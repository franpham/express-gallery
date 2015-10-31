"use strict";
// Sequelize will automatically create & update: id, created_at, updated_at;

module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define('Photo',
    { author: DataTypes.STRING, link: DataTypes.STRING, info: DataTypes.STRING },
    { classMethods: { associate: function(models) {
        Photo.belongsTo(models.User);
      }
    }},
    { underscored: true }   // MUST set to true since Postgres changes column names to lower-case;
  );
  return Photo;
};