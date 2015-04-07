'use strict';
var assert = require('chai').assert;
var csv = require('../../lib/csv');

describe('CSV Parser', function () {
  describe('mbank', function () {
    it('should parse simple string with date', function (done) {
      var string = '2010-09-10;;;;;;;;\n2010-09-09;;;;;;;;';
      csv.parse.mbank(string, function (err, data) {
        assert.lengthOf(data, 2);
        assert.isObject(data[0]);
        assert.isObject(data[1]);
        done();
      });
    });
    it('should not parse string with not allowed rows', function (done) {
      var string = ';;;;;;\n;;;;;\n;;';
      csv.parse.mbank(string, function (err, data) {
        assert.lengthOf(data, 0);
        done();
      });
    });
    it('should not parse string with invalid date', function (done) {
      var string = '2010-09-1;;;;;;;\n201-09-09;;;;;;;\b2014-09-091;;;;;;';
      csv.parse.mbank(string, function (err, data) {
        assert.lengthOf(data, 0);
        done();
      });
    });
    it('should ignore commented lines', function (done) {
      var string = '#;;;;;;;\n#;;;';
      csv.parse.mbank(string, function (err, data) {
        assert.lengthOf(data, 0);
        done();
      });
    });
    it('should create proper array of objects', function (done) {
      var string = '2010-09-10;;;;;;;;\n';
      csv.parse.mbank(string, function (err, data) {
        assert.property(data[0], 'date');
        assert.property(data[0], 'title');
        assert.property(data[0], 'sender');
        assert.property(data[0], 'accountNumber');
        assert.property(data[0], 'amount');
        done();
      });
    });
    it('should remove quotes from account number', function (done) {
      var string = '2010-09-10;;;;;\'123\';;;\n';
      csv.parse.mbank(string, function (err, data) {
        assert.equal(data[0].accountNumber, '123');
        done();
      });
    });
    it('should set amount to float', function (done) {
      var string = '2010-09-10;;;;;;25,25;;\n';
      csv.parse.mbank(string, function (err, data) {
        assert.equal(data[0].amount, 25.25);
        done();
      });
    });
  });
  describe('paypal', function () {
    it('should ignore the first header/line', function (done) {
      var string = ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n' +
        ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,';
      csv.parse.paypal(string, function (err, data) {
        assert.lengthOf(data, 1);
        done();
      });
    });
    it('should create err obj with prop message when different rows',
      function (done) {
        var string = ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n' +
          ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,';
        csv.parse.paypal(string, function (err, data) {
          assert.isUndefined(data);
          assert.isDefined(err.message);
          done();
        });
      });
    it('should create proper array of objects', function (done) {
      var string = ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n' +
        ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,';
      csv.parse.paypal(string, function (err, data) {
        assert.property(data[0], 'date');
        assert.property(data[0], 'title');
        assert.property(data[0], 'sender');
        assert.property(data[0], 'accountNumber');
        assert.property(data[0], 'amount');
        done();
      });
    });
    it('should remove double quotes from transfer properties', function (done) {
      var string = ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n' +
        '"",,,"",,,,,"a",,,"","",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,';
      csv.parse.paypal(string, function (err, data) {
        assert.equal(data[0].date, '');
        assert.equal(data[0].title, '');
        assert.equal(data[0].sender, '');
        assert.equal(data[0].accountNumber, '');
        done();
      });
    });
    it('should set amount to float', function (done) {
      var string = ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n' +
        ',,,,,,,,"25,25",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,';
      csv.parse.paypal(string, function (err, data) {
        assert.equal(data[0].amount, 25.25);
        done();
      });
    });
  });
});
