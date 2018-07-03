module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'role already exist'
      },
      validate: {
        is: {
          args: /\w+/g,
          msg: 'Input a valid title'
        },
        notEmpty: {
          msg: 'This field cannot be empty'
        }
      },
      field: 'title'
    }
  }, {
    freezeTableName: true,
  });
  Role.associate = function(models) {
    // associations can be defined here
    Role.hasMany(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        name:  'roleId',
        field: 'roleId'
      },
      sourceKey: models.Role.id, });
  };
  return Role;
};
