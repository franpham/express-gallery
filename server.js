"use strict";

var photo = require('./routes/photo');
var user = require('./routes/user');
var express = require('express');
var app = express();

var methodOverride = require('method-override');
var parser = require('body-parser');
var multer = require('multer');
var db = require('./models');

app.set('view engine', 'jade');
app.set('views', './views');
app.use(methodOverride('_method'));
app.use('/gallery', photo);
app.use('users', user);
app.use(express.static('public'));

app.use(multer());    // for parsing form uploads: multipart/form-data;
app.use(parser.json());   // for parsing application/ json;
app.use(parser.urlencoded({ extended: true }));
// for parsing form data: application/x-www-form-urlencoded

app.get('/', function(req, res) {
  res.redirect('/gallery');
});

var server = app.listen(3000, function() {
  db.sequelize.sync();
  console.log('Database synced.');
});
