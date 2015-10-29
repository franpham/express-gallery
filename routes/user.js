"use strict";

var express = require('express');
var router = express.Router();
var db = require('./models');
var User = db.User;
// ALL PATHS ARE RELATIVE TO /gallery

router.get('/', function(req, res) {
  User.findAll()
    .then(function(users) {
      res.render('users');
    });
});

router.get('/:id', function(req, res) {
  User.findById(req.params.id)
    .then(function(user) {
      res.render('user');
    });
});

router.get('/edit', function(req, res) {
  res.render('userForm');
});

router.get('/edit/:id', function(req, res) {
  User.findById(req.params.id)
    .then(function(user) {
      res.render('userForm');
    });
});

router.post('/new', function(req, res) {
  User.create({ username: req.body.username })
    .then(function(user) {
      res.render('user');
    });
});

router.put('/:id', function(req, res) {
  User.update({ username: req.body.username },
              { where: { id: req.params.id }})
    .then(function(num) {
      res.redirect('/' + req.params.id);
    });
});

router.get('/photos/:id', function(req, res) {
  db.Photo.findAll({ include: [{
        model: Photo,
        where: { userId: req.params.id }
      }]
    })
    .then(function(photos) {
      res.render('photos');
    });
});