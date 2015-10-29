"use strict";

var express = require('express');
var router = express.Router();
var db = require('./models');
var Photo = db.Photo;
// ALL PATHS ARE RELATIVE TO /gallery

router.get('/', function(req, res) {
  Photo.findAll()
    .then(function(photos) {
      res.render('photos');
    });
});

// validate link and add userId;
router.post('/new', function(req, res) {
  Photo.create({ title: req.body.title, link: req.body.link, info: req.body.info })
    .then(function(photo) {
      res.render('photo');
    });
});

// foreign key is model name + key name, camelCased;
router.get('/:id', function(req, res) {
  Photo.findById(req.params.id)
    .then(function(photo) {
      res.render('photo');
    });
});

// make html form to create and edit;
router.get('/edit', function(req, res) {
  res.render('photoForm');
});

// verify userId === session.userId;
router.get('/edit/:id', function(req, res) {
  Photo.findById(req.params.id)
    .then(function(photo) {
      res.render('photoForm');
    });
});

// verify userId === session.userId;
router.put('/:id', function(req, res) {
  Photo.update({ title: req.body.title, link: req.body.link, info: req.body.info },
               { where: { id: req.params.id }})
    .then(function(num) {
      res.redirect('/' + req.params.id);
    });
});

// verify userId === session.userId;
router.delete('/:id', function(req, res) {
  Photo.destroy({ where: { id: req.params.id }})
    .then(function(num) {
      res.render('photos');
    });
});

module.exports = router;