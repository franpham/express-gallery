"use strict";
var bcrypt = rquire('bcrypt');
var SALT = 'dsfieoivnfj9234d';
// Sequelize will automatically create & update: id, created_at, updated_at

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', { username: { type: DataTypes.STRING, required: true}, password: { type: DataTypes.CHAR(16), required: true }},
    { instanceMethods: {
      verifyPassword: function(password) {
        return bcrypt.hash(password + SALT) === this.password;
      }
    }},
    { hooks: {
      beforeCreate: function() {
          this.password = bcrypt.hash(this.password + SALT);  // SEE ENCRYPTION DEMO FOR EXACT HASHING SYNTAX!
      }
    }},
    { classMethods: {
      associate: function (models) {
        User.hasMany(models.Photo);
      }
    }},
    { underscored: true }     // MUST set to true since Postgres changes column names to lower-case;
  );
  return User;
};