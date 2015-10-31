"use strict";

var express = require('express');
var router = express.Router();
var db = require('./models');
var Photo = db.Photo;
// ALL PATHS ARE RELATIVE TO '/photos', except for redirect();

function verifyUserId(req, res, next) {
  if (!req.session || (req.method !== 'GET' && req.body.user_id !== req.session.user_id))
    return res.redirect('/403');
  next();
}

router.get('/', function(req, res) {
  Photo.findAll({ limit: 100, order: [['updatedAt', 'DESC']] })
    .then(function(photos) {
      res.render('photosGrid', { photos: photos });
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

// foreign key is model name + key name; case is determined by model's underscored;
router.post('/new', verifyUserId, function(req, res) {
  var link = req.body.link;
  link = link.indexOf('https') ? link.substring(7) : (link.indexOf('http') ? link.substring(6) : link);
  Photo.create({ title: req.body.title, link: link, info: req.body.info, user_id: req.session.user_id })
    .then(function(photo) {
      res.redirect('/photos/' + photo.id);
    });
});

router.get('/edit', verifyUserId, function(req, res) {    // returns form to make new Photo;
  var temp = { title: '', link: '', info: '', user_id: '' };
  res.render('photoForm', { photo: temp });
});

router.get('/edit/:id', verifyUserId, function(req, res) {
  Photo.findById(req.params.id)
    .then(function(photo) {
      if (photo.user_id !== req.session.user_id)
        return res.redirect('/403');    // MUST set put for hidden field;
      res.render('photoForm', { photo: photo, put: "PUT" });
    });
});

router.put('/:id', verifyUserId, function(req, res) {
  var link = req.body.link;
  link = link.indexOf('https') ? link.substring(7) : (link.indexOf('http') ? link.substring(6) : link);
  Photo.update({ title: req.body.title, link: link, info: req.body.info },
               { where: { id: req.params.id, user_id: req.body.user_id }})
    .then(function(num) {
      res.redirect('/photos/' + req.params.id);
    });
});

router.delete('/:id', verifyUserId, function(req, res) {
  Photo.destroy({ where: { id: req.params.id, user_id: req.body.user_id }})
    .then(function(num) {
      res.redirect('/photos/');
    });
});

module.exports = router;