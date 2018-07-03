import Bcrypt from 'bcrypt';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'firstName'
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'lastName'
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'userName'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      field: 'email'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [ 6, 200 ],
          message: 'Your password must be atleast 6 characters long'
        }
      },
      field: 'password'
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      field: 'roleId'
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    validate: {
      validatePassword() {
        if (this.password.length !== null && (!(/\w+/g.test(this.password))
          || (this.password.length < 8))) {
          throw new Error('Minimum of 8 characters is required');
        }
      }
    },
    freezeTableName: true,
    hooks: {
      beforeCreate: (user) => {
        user.password = Bcrypt.hashSync(user.password, Bcrypt.genSaltSync(10));
      },
      beforeUpdate: (user) => {
        if (user.password) {
          user.password = Bcrypt.hashSync(user.password, Bcrypt.genSaltSync(10));
        }
      }
    }
  });
  User.associate = function(models) {
    User.hasMany(models.Document, {
      foreignKey: {
        name:  'userId',
        field: 'userId'
      },
      sourceKey: models.User.id,
    });
    User.belongsTo(models.Role, {
      foreignKey: {
        name:  'roleId',
        field: 'roleId'
      },
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };

  User.prototype.validPassword = function (password) {
    return Bcrypt.compare(password, this.password).then(function(res) {
      return res;
    });
  };
  return User;
};
