'use strict';
var express = require('express');
var router = express.Router();

var Server = require('../models/server');
var User = require('../models/user');

router.get('/', function (req, res) {
  User.find({})
    .populate('accounts.hostname')
    .sort({'accounts.hostname': 'desc', 'accounts.username': 'asc'})
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
  Server.find({}, '_id hostname', function (err, servers) {
    res.render('admin/user/add', {servers: servers});
  });
});

router.post('/user/add', function (req, res) {
  var newUser = new User({
    user: req.body.user,
    gg: req.body.gg,
    notes: req.body.notes,
    accounts: [{
      username: req.body.username,
      password: req.body.password,
      hostname: req.body.hostname,
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
});

module.exports = router;