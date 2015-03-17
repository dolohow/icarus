'use strict';
var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStoreSession = require('connect-mongo')(session);
var expressValidator = require('express-validator');
var passwordless = require('passwordless');
var MongoStore = require('passwordless-mongostore');
var email = require('emailjs');
var mongoose = require('mongoose');
var i18n = require('i18n');
var basicAuth = require('http-auth');
var multer = require('multer');

var index = require('./routes/index');
var auth = require('./routes/auth');
var admin = require('./routes/admin');
var panel = require('./routes/panel');

var config = require('./config');

var smtpServer = email.server.connect(config.email);
passwordless.init(new MongoStore(config.passwordless));
mongoose.connect(config.mongodb);

passwordless.addDelivery(
  function (tokenToSend, uidToSend, recipient, callback) {
    smtpServer.send({
      text: 'Hello!\nAccess your account here: http://' +
      config.domain + '/?token=' + tokenToSend + '&uid=' +
      encodeURIComponent(uidToSend),
      from: config.email.user,
      to: recipient,
      subject: 'Welcome to ' + config.domain
    }, function (err, message) {
      if (err) {
        console.log(err, message);
      }
      callback(err);
    });
  });

i18n.configure({
  locales: ['en', 'pl'],
  directory: __dirname + '/locales'
});

var basic = basicAuth.basic({
    realm: 'Login is required'
  }, function (username, password, callback) {
    callback(username === config.basicAuth.username &&
    password === config.basicAuth.password);
  }
);

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressValidator());
app.use(i18n.init);
app.use(multer({inMemory: true}));
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: new MongoStoreSession({mongooseConnection: mongoose.connection})
}));
expressValidator.validator.extend('toLowerCase',
  function (str) {
    return str.toLowerCase();
  }
);
app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({successRedirect: '/'}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/', auth);
app.use('/panel', passwordless.restricted(), panel);
app.use('/admin', basicAuth.connect(basic), admin);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
