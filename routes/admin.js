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

router.get('/account/add', function (req, res) {
  async.parallel([
      function (callback) {
        Server.find({}, '_id hostname')
          .sort({'hostname': 'asc'})
          .exec(function (err, servers) {
            if (err) {
              return callback(err);
            }
            callback(null, servers);
          }
        );
      },
      function (callback) {
        User.find({}, '_id user')
          .sort({'user': 'asc'})
          .exec(function (err, users) {
            if (err) {
              return callback(err);
            }
            callback(null, users);
          });
      }
    ],
    function (err, results) {
      res.render('admin/account/add', {servers: results[0], users: results[1]});
    });

});

router.post('/account/add', function (req, res) {
  User.findById(req.body.user, function (err, user) {
    user.accounts.push({
      username: req.body.username,
      password: req.body.password,
      hostname: req.body.hostname,
      allowedTorrents: req.body.allowedTorrents,
      allowedTransfer: req.body.allowedTransfer,
      allowedVNC: req.body.allowedVNC,
      allowedCapacity: req.body.allowedCapacity,
      price: req.body.price,
      validity: req.body.validity
    });
    user.save(function (err) {
      if (err) {
        console.log(err);
      }
      res.json({status: 'ok'});
    });
  });
});

router.get('/account/edit/:id', function (req, res) {
  async.parallel([
      function (callback) {
        User.findOne({'accounts._id': req.params.id},
          'user accounts.$ transfers')
          .populate('accounts.hostname')
          .exec(function (err, user) {
            if (err) {
              return callback(err);
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
              return callback(err);
            }
            callback(null, servers);
          });
      }
    ],
    function (err, results) {
      res.render('admin/account/edit', {
        account: results[0].accounts[0],
        transfers: results[0].transfers.sort(function (d1, d2) {
          return d1.date - d2.date;
        }),
        servers: results[1],
        user: results[0].user
      });
    }
  );
});

router.post('/account/edit/:id', function (req, res) {
  User.update({'accounts._id': req.params.id}, {
    $set: {
      'accounts.$.username': req.body.username,
      'accounts.$.password': req.body.password,
      'accounts.$.hostname': req.body.hostname,
      'accounts.$.allowedTorrents': req.body.allowedTorrents,
      'accounts.$.allowedTransfer': req.body.allowedTransfer,
      'accounts.$.allowedVNC': req.body.allowedVNC,
      'accounts.$.allowedCapacity': req.body.allowedCapacity,
      'accounts.$.price': req.body.price,
      'accounts.$.validity': req.body.validity
    }
  }, function () {
    res.json({status: 'ok'});
  });
});

router.get('/account/remove/:id', function (req, res) {
  User.findOne({'accounts._id': req.params.id}, 'accounts.$.username',
    function (err, user) {
      res.render('admin/account/remove', {username: user.accounts[0].username});
    });
});

router.post('/account/remove/:id', function (req, res) {
  User.findOne({'accounts._id': req.params.id}, function (err, user) {
    user.accounts.id(req.params.id).remove();
    user.save(function (err) {
      if (err) {
        console.log(err);
      }
      res.redirect('/admin');
    });
  });
});

router.get('/payment', function (req, res) {
  res.render('admin/payment');
});

router.post('/payment', function (req, res) {
  if (req.files.mbank) {
    var mbank = iconv.decode(req.files.mbank.buffer, 'cp1250');
    csv.parse.mbank(mbank, function (err, transfers) {
      if (err) {
        res.json({err: err});
      }
      async.series([
          function (callback) {
            User.find({}, '_id user')
              .sort({'user': 'asc'})
              .exec(function (err, users) {
                if (err) {
                  console.log(err);
                }
                callback(null, users);
              });
          },
          function (callback) {
            for (var i = transfers.length - 1; i >= 0; i--) {
              User.addTransfer(transfers[i]);
            }
            callback();
          }
        ],
        function (err, results) {
          res.render('admin/payment', {
            users: results[0],
            transfers: transfers});
        });
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

router.post('/payment/add', function (req, res) {
  User.findById(req.body.user, function (err, user) {
    if (user.accountNumbers.indexOf(req.body.accountNumber) !== -1) {
      return res.json({msg: 'Account number already exists'});
    }
    user.accountNumbers.push(req.body.accountNumber);
    user.save(function () {
      res.json({msg: 'OK'});
    });
  });
});

module.exports = router;
