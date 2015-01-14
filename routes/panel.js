'use strict';
var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function (req, res) {
  User.findOne({user: req.user})
    .populate('accounts.hostname')
    .exec(function (err, user) {
      res.render('panel/index', {user: req.user, data: user});
    });
});

module.exports = router;
