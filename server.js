"use strict";

var photo = require('./routes/photo');
var user = require('./routes/user');
var express = require('express');
var app = express();

var methodOverride = require('method-override');
var parser = require('body-parser');
var db = require('./models');
// var multer = require('multer');
// app.use(multer());    // for parsing uploads: multipart/form-data;

app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));
app.use(methodOverride('_method'));   // enable PUT & DELETE methods;
app.use('/photos', photo);            // set the routes;
app.use('users', user);

app.use(parser.json());   // for parsing application/ json;
app.use(parser.urlencoded({ extended: true }));
// for parsing form data: application/x-www-form-urlencoded

app.get('/', function(req, res) {
  res.redirect('/photos');
});

app.get('/403', function(req, res) {
  res.render('403');
});

var server = app.listen(3000, function() {
  db.sequelize.sync();
  console.log('Database synced.');
});
