"use strict";

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/new', function(req, res) {
  res.render('create');
});

router.post('/new', function(req, res) {
  res.render('photo');
});

router.get('/:id', function(req, res) {
  res.render('photo');
});

router.get('/edit/:id', function(req, res) {
  res.render('update');
});

router.put('/:id', function(req, res) {
  res.render('photo');
});

router.delete('/:id', function(req, res) {
  res.render('index');
});

module.exports = router;