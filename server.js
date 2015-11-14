'use strict';

const path = require('path');
//var fs = require('fs');
const config = require('./config');

const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('port', config.port);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser(config.cookieSecret));

const session = require('express-session');
app.set('trust proxy', 1);
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: config.cookieSecret,
  cookie: {path: '/', maxAge: 60000, secure: false}
}));

var compression = require('compression');
app.use(compression({threshold: 1}));

var favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'public/img/favicon.png')));

var logger = require('morgan');
app.use(logger('dev'));

var csrf = require('csurf');
var csrfProtection = csrf({cookie: true});

//app.use(function (req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});
//
//app.use(function (err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: err
//  });
//});

require('./app')(app);

app.listen(app.get('port'));
console.log("Server running on port: " + app.get('port'));