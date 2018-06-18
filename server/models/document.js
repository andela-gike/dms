module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'user ID must be an integer' }
      },
      field: 'userId'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'You must provide a Title'
        }
      },
      field: 'title'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'You cannot have an empty Document'
        }
      },
      field: 'content'
    },
    access: {
      type: DataTypes.STRING,
      defaultValue: 'public',
      validate: {
        isIn: [ [ 'public', 'private', 'role' ] ]
      },
      allowNull: false,
      field: 'access'
    },
    userRoleId: {
      type: DataTypes.INTEGER,
      field: 'userRoleId'
    }
  }, {
    freezeTableName: true
  });
  Document.associate = function(models) {
    // associations can be defined here
    Document.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Document;
};
