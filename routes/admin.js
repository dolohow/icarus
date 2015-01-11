'use strict';
var express = require('express');
var router = express.Router();
var iconv = require('iconv-lite');

var csv = require('../lib/csv');

var Server = require('../models/server');
var User = require('../models/user');

router.get('/', function (req, res) {
  User.find({})
    .populate('accounts.hostname')
    .sort({'accounts.hostname': 'asc', 'accounts.username': 'asc'})
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
  Server.find({}, '_id hostname')
    .sort({'hostname': 'asc'})
    .exec(function (err, servers) {
      res.render('admin/user/add', {servers: servers});
    }
  );
});

router.post('/user/add', function (req, res) {
  var newUser = new User({
    user: req.body.user,
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

router.get('/payment/add', function (req, res) {
  res.render('admin/payment');
});

router.post('/payment/add', function (req, res) {
  if (req.files.mbank.fieldname) {
    var data = iconv.decode(req.files.mbank.buffer, 'cp1250');
    csv.parse(data, function () {
      res.json({status: 'ok'});
    });
  }
});

module.exports = router;
