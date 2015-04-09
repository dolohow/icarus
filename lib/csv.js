/* jshint camelcase: false */
'use strict';
var parse = require('csv-parse');

function substituteComma(str) {
  return str.replace(/,/g, '.');
}

function removeQuotes(str) {
  return str.replace(/'/g, '').replace(/"/g, '');
}

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
      var arr = [];
      var regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
      for (i = output.length - 1; i >= 0; i--) {
        if (output[i].length === 9 && output[i][0].match(regex) !== null) {
          arr.push({
            date: output[i][0],
            title: output[i][3],
            sender: output[i][4],
            accountNumber: removeQuotes(output[i][5]),
            amount: parseFloat(substituteComma(output[i][6]))
          });
        }
      }
      callback(null, arr);
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
      var arr = [];
      output.splice(0, 1);
      for (i = output.length - 1; i >= 0; i--) {
        if (output[i].length !== 47) {
          return callback(new Error('PayPal CSV parser is outdated'));
        }
        arr.push({
          date: output[i][0],
          title: output[i][11],
          sender: output[i][3],
          accountNumber: output[i][12],
          amount: parseFloat(substituteComma(output[i][8]))
        });
      }
      callback(null, arr);
    }
  );
}

module.exports = {
  parse: {
    mbank: mbank,
    paypal: paypal
  }
};
