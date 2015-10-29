"use strict";
// Sequelize will automatically create & update: id, createdAt, updatedAt

module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define('Photo',
    { author: DataTypes.STRING, link: DataTypes.STRING, info: DataTypes.STRING },
    { classMethods: { associate: function(models) {
        Photo.belongsTo(models.User);
    }}}
  );
  return Photo;
};