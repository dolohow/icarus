'use strict';
var express = require('express');
var router = express.Router();
var iconv = require('iconv-lite');
var async = require('async');

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

router.get('/user/edit/:id', function (req, res) {
  async.parallel([
      function (callback) {
        User.findById(req.params.id)
          .populate('accounts.hostname')
          .exec(function (err, user) {
            if (err) {
              callback(err);
            }
            callback(null, user);
          }
        );
      },
      function (callback) {
        Server.find({})
          .sort({'hostname': 'asc'})
          .exec(function (err, servers) {
            if (err) {
              callback(err);
            }
            callback(null, servers);
          });
      }
    ],
    function (err, results) {
      res.render('admin/user/edit', {user: results[0], servers: results[1]});
    }
  );
});

router.post('/user/edit/:id', function (req, res) {
  User.update({_id: req.params.id}, {
    $set: {
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
    }
  }, function () {
    res.json({status: 'ok'});
  });
});

router.get('/payment/add', function (req, res) {
  res.render('admin/payment');
});

router.post('/payment/add', function (req, res) {
  if (req.files.mbank) {
    var mbank = iconv.decode(req.files.mbank.buffer, 'cp1250');
    csv.parse.mbank(mbank, function (err, data) {
      if (err) {
        res.json({err: err});
      }
      res.json(data);
    });
  }
  if (req.files.paypal) {
    var paypal = iconv.decode(req.files.paypal.buffer, 'cp1250');
    csv.parse.paypal(paypal, function (err, data) {
      if (err) {
        res.json({err: err});
      }
      res.json(data);
    });
  }
});

module.exports = router;
