'use strict';
var express = require('express');
var router = express.Router();
var passwordless = require('passwordless');

var User = require('../models/user');

router.post('/sendtoken',
  function (req, res, next) {
    req.checkBody('user', 'Invalid email').isLength(1, 200).isEmail();
    req.sanitize('user').toLowerCase().trim();

    var errors = req.validationErrors();
    if (errors) {
      res.json(errors);
      return;
    }
    next();
  },
  passwordless.requestToken(
    function (email, delivery, callback) {
      User.findOne({user: email}, function (err, user) {
        if (err) {
          callback(err.toString());
        }
        else if (user) {
          callback(null, user.user);
        }
        else {
          var newUser = new User({user: email});
          newUser.save(function (err, user) {
            if (err) {
              console.log(err);
              callback(err.toString());
            } else {
              callback(null, user.user);
            }
          });
        }
      });
    }),
  function (req, res) {
    res.json({msg: 'Check your email'});
  }
);

module.exports = router;
