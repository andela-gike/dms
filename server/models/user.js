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
    }
  }, {
  },
  {
    freezeTableName: true,
  });
  User.classMethods = {
    associate (models) {
    // associations can be defined here
      User.hasMany(models.documents, { foreignKey: 'userId' });
      User.belongsTo(models.roles, {
        foreignKey: 'roleId',
        onDelete: 'CASCADE'
      });
    }
  }
  User.instanceMethods = {
    generateHashedPassword() {
      this.password = Bcrypt.hashSync(this.password, Bcrypt.genSaltSync(9));
    },
    validatePassword(password) {
      return Bcrypt.compareSync(password, this.password);
    }
  };
  User.hooks = {
    beforeCreate(user) {
      user.instanceMethods.generateHashedPassword();
    },
    beforeUpdate(user) {
      user.instanceMethods.generateHashedPassword();
    }
  };
  return User;
};
