'use strict';
var assert = require('chai').assert;
var csv = require('../../lib/csv');

describe('CSV Parser', function () {
  it('should parse simple string with date', function (done) {
    var string = '2010-09-10;;;;;;;;\n2010-09-09;;;;;;;;';
    csv.parse(string, function (err, data) {
      assert.lengthOf(data, 2);
      assert.lengthOf(data[0], 9);
      assert.lengthOf(data[1], 9);
      done();
    });
  });
  it('should not parse string with not allowed rows', function (done) {
    var string = ';;;;;;\n;;;;;\n;;';
    csv.parse(string, function (err, data) {
      assert.lengthOf(data, 0);
      done();
    });
  });
  it('should not parse string with invalid date', function (done) {
    var string = '2010-09-1;;;;;;;\n201-09-09;;;;;;;\b2014-09-091;;;;;;';
    csv.parse(string, function (err, data) {
      assert.lengthOf(data, 0);
      done();
    });
  });
  it('should ignore commented lines', function (done) {
    var string = '#;;;;;;;\n#;;;';
    csv.parse(string, function (err, data) {
      assert.lengthOf(data, 0);
      done();
    });
  })
});
