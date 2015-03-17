'use strict';
var assert = require('chai').assert;
var request = require('supertest');
var rewire = require('rewire');
var mongoose = require('mongoose');

var app = rewire('../../app.js');

var config = require('../../config');
var User = require('../../models/user.js');

describe('Authentication', function () {
  before(function (done) {
    mongoose.connection.db.dropDatabase();
    app.listen(5000);
    done();
  });
  var url = 'http://localhost:5000';
  it('should send email', function (done) {
    app.__set__('smtpServer', {
      send: function (obj, callback) {
        assert.equal(obj.to, 'email@email.com', 'Email differs');
        callback();
      }
    });
    request(url)
      .post('/sendtoken')
      .send('user=email@email.com')
      .end(function () {
        done();
      });
  });
  it('should add new user to database', function (done) {
    request(url)
      .post('/sendtoken')
      .send('user=email@email.com')
      .end(function () {
        User.findOne({user: 'email@email.com'}, function (err, user) {
          assert.isNotNull(user);
          done();
      });
    });
  });
});
