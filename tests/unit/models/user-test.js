'use strict';
var assert = require('chai').assert;
var mongoose = require('mongoose');
var async = require('async');

var User = require('../../../models/user.js');

var correctData = {
  date: '2015-01-02',
  title: 'title',
  sender: 'sender',
  accountNumber: '13',
  amount: 10.00
};

describe('Model User', function () {
  describe('Transfers', function () {
    before(function (done) {
      mongoose.createConnection('mongodb://localhost/db-test');
      done();
    });
    after(function (done) {
      mongoose.disconnect();
      done();
    });
    beforeEach(function (done) {
      mongoose.connection.db.dropDatabase();
      var user = new User({
        user: 'test@test.com',
        accountNumbers: [
          '13'
        ]
      });
      user.save(function () {
        done();
      });
    });
    it('should reject incomplete transfers', function (done) {
      var data = {
        title: 'title',
        accountNumber: '13'
      };
      User.addTransfer(data, function (err, user) {
        assert.equal(err, 'Transfer incomplete');
        assert.isUndefined(user);
        done();
      });
    });
    it('should populate err when user not found', function (done) {
      var data = {
        date: '2015-01-02',
        title: 'title',
        sender: 'sender',
        accountNumber: '14',
        amount: 10.00
      };
      User.addTransfer(data, function (err, user) {
        assert.equal(err, 'No users found');
        assert.isUndefined(user);
        done();
      });
    });
    it('should add new transfer when account number matches', function (done) {
      User.addTransfer(correctData, function (err, user) {
        assert.property(user.transfers[0], 'title', 'title');
        assert.lengthOf(user.transfers, 1);
        done();
      });
    });
    it('should not add the same transfer', function (done) {
      async.series([
          function (callback) {
            User.addTransfer(correctData, function () {
              callback();
            });
          },
          function (callback) {
            User.addTransfer(correctData, function (err) {
              callback(err);
            });
          }
        ],
        function (err) {
          assert.equal(err, 'Transfer exists');
          User.findOne({user: 'test@test.com'}, function (err, user) {
            assert.property(user.transfers[0], 'title', 'title');
            assert.lengthOf(user.transfers, 1);
            done();
          });
        }
      );
    });
  });
});
