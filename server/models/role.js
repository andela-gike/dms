module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'title'
    }
  }, {
    freezeTableName: true
  });
  Role.associate = function(models) {
    // associations can be defined here
    Role.hasMany(models.user, {
      onDelete: 'CASCADE', foreignKey: 'roleId' });
  };
  return Role;
};
