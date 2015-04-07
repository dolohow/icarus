'use strict';
var express = require('express');
var router = express.Router();

var ssh = require('../lib/ssh');
var User = require('../models/user');

function getUserData(req, callback) {
  User.findOne({user: req.user, 'accounts.username': req.params.username})
    .where('accounts.username').equals(req.params.username)
    .select('accounts.$')
    .populate('accounts.hostname')
    .exec(function (err, user) {
      if (err) {
        console.log(err);
        return callback({err: 'Something went wrong'});
      }
      if (user) {
        user = {
          username: user.accounts[0].username,
          hostname: user.accounts[0].hostname.hostname,
          allowedTorrents: user.accounts[0].allowedTorrents,
          allowedTransfer: user.accounts[0].allowedTransfer,
          allowedVNC: user.accounts[0].allowedVNC,
          allowedCapacity: user.accounts[0].allowedCapacity,
          price: user.accounts[0].price,
          validity: user.accounts[0].validity
        };
        return callback(null, user);
      }
      return callback({err: 'Account not exists'});
    });
}

router.get('/', function (req, res) {
  User.findOne({user: req.user})
    .populate('accounts.hostname')
    .exec(function (err, user) {
      res.render('panel/index', {user: req.user, data: user});
    });
});

router.get('/account/:username', function (req, res) {
  res.render('panel/account');
});

router.get('/account/:username/data', function (req, res) {
  getUserData(req, function (err, user) {
    if (user) {
      return res.json(user);
    }
    return res.json(err);
  });
});

router.get('/account/:username/vnc', function (req, res) {
  getUserData(req, function (err, user) {
    if (user && user.allowedVNC) {
      new ssh.SSH(user.username,
        user.hostname)
        .statusVNC(function (err, std) {
          if (err) {
            return res.json(err);
          }
          res.json(std);
        });
    }
  });
});

router.get('/account/:username/vnc/start', function (req, res) {
  getUserData(req, function (err, user) {
    if (user && user.allowedVNC) {
      new ssh.SSH(user.username,
        user.hostname)
        .startVNC(function (err, std) {
          if (err) {
            return res.json(err);
          }
          res.json(std);
        });
    }
  });
});

router.get('/account/:username/vnc/stop', function (req, res) {
  getUserData(req, function (err, user) {
    if (user && user.allowedVNC) {
      new ssh.SSH(user.username,
        user.hostname)
        .stopVNC(function (err, std) {
          if (err) {
            return res.json(err);
          }
          res.json(std);
        });
    }
  });
});

router.get('/account/:username/vnc/restart', function (req, res) {
  getUserData(req, function (err, user) {
    if (user && user.allowedVNC) {
      new ssh.SSH(user.username,
        user.hostname)
        .restartVNC(function (err, std) {
          if (err) {
            return res.json(err);
          }
          res.json(std);
        });
    }
  });
});

module.exports = router;
