'use strict';
var express = require('express');
var router = express.Router();

var ssh = require('../lib/ssh');
var User = require('../models/user');

router.get('/', function (req, res) {
  User.findOne({user: req.user})
    .populate('accounts.hostname')
    .exec(function (err, user) {
      res.render('panel/index', {user: req.user, data: user});
    });
});

router.get('/account/:id', function (req, res) {
  User.findOne({user: req.user, 'accounts._id': req.params.id},
    'user accounts.$')
    .populate('accounts.hostname')
    .exec(function (err, user) {
      if (err) {
        console.log(err);
        return res.json({msg: 'Error'});
      }
      if (user) {
        return res.render('panel/account', {account: user.accounts[0]});
      }
      res.json({msg: 'Account not exists'});
    });
});

router.get('/account/:id/disk', function (req, res) {
  User.findOne({user: req.user, 'accounts._id': req.params.id},
    'accounts.$')
    .populate('accounts.hostname')
    .exec(function (err, user) {
      if (err) {
        console.log(err);
        return res.json({msg: 'Error'});
      }
      if (user) {
        new ssh.SSH(user.accounts[0].username,
          user.accounts[0].hostname.hostname)
          .getDiskUsage(function (err, disk) {
            res.json({disk: disk});
          });
      }
    });
});

module.exports = router;
