/* jshint camelcase: false */
'use strict';
var parse = require('csv-parse');

function mbank(input, callback) {
  parse(input, {
      comment: '#',
      delimiter: ';',
      skip_empty_lines: true,
      trim: true
    },
    function (err, output) {
      if (err) {
        return callback(err);
      }
      var i;
      var regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
      for (i = output.length - 1; i >= 0; i--) {
        if (output[i].length !== 9 || output[i][0].match(regex) === null) {
          output.splice(i, 1);
        }
      }
      callback(null, output);
    }
  );
}

function paypal(input, callback) {
  parse(input, {
      delimiter: ',',
      skip_empty_lines: true,
      trim: true
    },
    function (err, output) {
      if (err) {
        return callback(err);
      }
      var i;
      output.splice(0, 1);
      for (i = output.length - 1; i >= 0; i--) {
        if (output[i].length !== 47) {
          return callback({message: 'PayPal CSV parser is outdated'});
        }
      }
      callback(null, output);
    }
  );
}

module.exports = {
  parse: {
    mbank: mbank,
    paypal: paypal
  }
};
