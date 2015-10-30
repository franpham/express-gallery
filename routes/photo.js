"use strict";

var express = require('express');
var router = express.Router();
var db = require('./models');
var Photo = db.Photo;
// ALL PATHS ARE RELATIVE TO '/photos', except for redirect();

router.get('/', function(req, res) {
  Photo.findAll({ limit: 100, order: [['updatedAt', 'DESC']] })
    .then(function(photos) {
      res.render('photosGrid', { photos: photos });
    });
});

// foreign key is model name + key name, camelCased;
router.post('/new', function(req, res) {
  if (!req.session)
    return res.redirect('/' + 403);
  var link = req.body.link;
  link = link.indexOf('https') ? link.substring(7) : (link.indexOf('http') ? link.substring(6) : link);
  Photo.create({ title: req.body.title, link: link, info: req.body.info, userId: req.session.userId })
    .then(function(photo) {
      res.redirect('/photos/' + photo.id);
    });
});

router.get('/:id', function(req, res) {
  Photo.findAll({ limit: 10, order: [['updatedAt', 'DESC']] })
    .then(function(photos) {
      var image;    // the image to edit;
      photos = photos.filter(function(val) {
        if (val.id === req.params.id)
          image = val;
        return val.id !== req.params.id;
      });
      if (image)
        return res.render('photoDetails', { image: image, photos: photos });
      Photo.findById(req.params.id)
        .then(function(pic) {
          res.render('photoDetails', { image: pic, photos: photos });
        });
    });
});

router.get('/edit', function(req, res) {    // returns form to make new Photo;
  if (!req.session)
    return res.redirect('/' + 403);
  var temp = { userId: req.session.userId, title: '', link: '', info: '' };
  res.render('photoForm', { photo: temp });
});

router.get('/edit/:id', function(req, res) {
  if (!req.session || req.body.userId !== req.session.userId)
    return res.redirect('/' + 403);
  Photo.findById(req.params.id)
    .then(function(photo) {
      res.render('photoForm', { photo: photo });
    });
});

router.put('/:id', function(req, res) {
  if (!req.session || req.body.userId !== req.session.userId)
    return res.redirect('/' + 403);
  var link = req.body.link;
  link = link.indexOf('https') ? link.substring(7) : (link.indexOf('http') ? link.substring(6) : link);
  Photo.update({ title: req.body.title, link: link, info: req.body.info },
               { where: { id: req.params.id }})
    .then(function(num) {
      res.redirect('/photos/' + req.params.id);
    });
});

router.delete('/:id', function(req, res) {
  if (!req.session || req.body.userId !== req.session.userId)
    return res.redirect('/' + 403);
  Photo.destroy({ where: { id: req.params.id }})
    .then(function(num) {
      res.redirect('/photos/');
    });
});

module.exports = router;