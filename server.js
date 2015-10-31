"use strict";

var photo = require('./routes/photo');
var user = require('./routes/user');
var db = require('./models');

var express = require('express');   // declare first;
var methodOverride = require('method-override');
var parser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(express);
var app = express();

// Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.
// cookie-parser is not required; express-session now directly reads and writes cookies on req/res.
// var multer = require('multer');      // for parsing uploads: multipart/form-data;
// app.use(multer());

app.set('view engine', 'jade');
app.set('views', './views');
if (app.get('env') === 'production')
  app.set('trust proxy', 1);
// If secure is set and site is accessed over HTTP, the cookie will not be set; to enable testing locally: app.set('trust proxy', 1);

// IMPORTANT: middlewares are used sequentially in the listed order;
app.use(session({ key: 'app.sess', secret: '4w89tdfnb4w8ts', cookie: { secure: true }, store: new RedisStore() }));
app.use(methodOverride('_method'));   // enable PUT & DELETE methods;
app.use(parser.json());   // for parsing application/ json;
app.use(parser.urlencoded({ extended: true }));
// for parsing form data: application/x-www-form-urlencoded

app.use(express.static('public'));
app.use('/photos', photo);     // set the routes;
app.use('/users', user);

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
