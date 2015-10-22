"use strict";

var gallery = require('./routes/gallery');
var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.set('views', './views');

app.use(express.static('public'));
app.use('/gallery', gallery);

app.get('/', function(req, res) {
  res.redirect('/gallery');
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s ', host, port);
});
