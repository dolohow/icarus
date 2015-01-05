'use strict';
var express = require('express');
var router = express.Router();

var Server = require('../models/server');
var User = require('../models/user');

router.get('/', function (req, res) {
  User.find({})
    .populate('accounts.hostname')
    .exec(function (err, users) {
      res.render('admin/index', {users: users});
    }
  );
});

router.get('/server/add', function (req, res) {
  res.render('admin/server/add');
});

router.post('/server/add', function (req, res) {
  var newServer = new Server({
    hostname: req.body.hostname,
    link: req.body.link,
    price: req.body.price
  });
  newServer.save(function (err) {
    if (err) {
      console.log(err);
    }
    res.json({status: 'ok'});
  });
});

router.get('/user/add', function (req, res) {
  res.render('admin/user/add');
});

router.post('/user/add', function (req, res) {
  Server.findOne({hostname: req.body.hostname}, '_id',
    function (err, server) {
      var newUser = new User({
        user: req.body.user,
        gg: req.body.gg,
        accounts: [{
          username: req.body.username,
          password: req.body.password,
          hostname: server._id,
          allowedTorrents: req.body.allowedTorrents,
          allowedTransfer: req.body.allowedTransfer,
          allowedVNC: req.body.allowedVNC,
          allowedCapacity: req.body.allowedCapacity,
          price: req.body.price,
          validity: req.body.validity
        }]
      });
      newUser.save(function (err) {
        if (err) {
          console.log(err);
        }
        res.json({status: 'ok'});
      });
    }
  );
});

module.exports = router;
