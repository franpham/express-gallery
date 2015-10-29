"use strict";
// Sequelize will automatically create & update: id, createdAt, updatedAt

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', { username: DataTypes.STRING }, { classMethods:
    { associate: function (models) {
      User.hasMany(models.Photo);
    }}
  });
  return User;
};