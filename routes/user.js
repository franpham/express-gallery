"use strict";

var express = require('express');
var router = express.Router();
var db = require('./models');
var User = db.User;
// ALL PATHS ARE RELATIVE TO '/users', except for redirect();

function verifyUserId(req, res, next) {
  if (!req.session || (req.method !== 'GET' && req.params.id !== req.session.user_id))
    return res.redirect('/403');
  next();
}

router.get('/', function(req, res) {
  User.findAll({ limit: 100, order: [['updated_at', 'DESC']] })
    .then(function(users) {
      res.render('usersList', { users: users });
    });
});

router.get('/edit', function(req, res) {
  var temp = { username: '', id: '' };
  res.render('userForm', { user: temp });
});

router.get('/edit/:id', verifyUserId, function(req, res) {
  User.findById(req.params.id)
    .then(function(user) {          // MUST set put for hidden field;
      res.render('userForm', { user: user, put: "PUT" });
    });
});

router.post('/new', function(req, res) {
  if (req.session)
    return res.redirect('/403');    // only new visitors can create Users;
  User.create({ username: req.body.username })
    .then(function(user) {
      res.session.user_id = user.id;         // set user_id of the LOGGED IN USER;
      res.redirect('/users/' + user.id);
    });
});

router.put('/:id', verifyUserId, function(req, res) {
  User.update({ username: req.body.username },
              { where: { id: req.params.id }})
    .then(function(num) {
      res.redirect('/users/' + req.params.id);
    });
});

// foreign key is model name + key name, camelCased; case is determined by model's underscored;
router.get('/:id', function(req, res) {
  db.Photo.findAll({
    include: [{ model: User, where: { user_id: User.id } }],
    order: [['updated_at', 'DESC']]
    })
    .then(function(photos) {
      var first = photos[0];
      res.render('photoDetails', { image: first, photos: photos.slice(1) });
    });
});

module.exports = router;