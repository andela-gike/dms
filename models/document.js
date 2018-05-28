'use strict';
module.exports = (sequelize, DataTypes) => {
  var Document = sequelize.define('Document', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    access: DataTypes.STRING,
    UserRoleId: DataTypes.INTEGER
  }, {});
  Document.associate = function(models) {
    // associations can be defined here
  };
  return Document;
};