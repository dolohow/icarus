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
    })
  });
  describe('paypal', function () {
    it('should ignore the first header/line', function (done) {
      var string = ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n' +
        ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,';
      csv.parse.paypal(string, function (err, data) {
        assert.lengthOf(data, 1);
        done();
      })
    });
    it('should create err obj with prop message when different rows', function (done) {
      var string = ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n' +
        ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,';
      csv.parse.paypal(string, function (err, data) {
        assert.isUndefined(data);
        assert.isDefined(err.message);
        done();
      })
    });
  })
});
