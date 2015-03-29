'use strict';

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: {unique: true}
  },
  notes: String,
  accountNumbers: [{type: String}],
  transfers: [{
    date: Date,
    title: String,
    sender: String,
    amount: Number
  }],
  money: {type: Number, default: 0},
  accounts: [{
    username: String,
    hostname: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Servers'
    },
    allowedTorrents: Number,
    allowedTransfer: Number,
    allowedVNC: Boolean,
    allowedCapacity: Number,
    price: Number,
    validity: Date
  }]
});

userSchema.statics.addTransfer = function (data, callback) {
  callback = (typeof callback === 'function') ? callback : function() {};
  this.findOne({accountNumbers: data.accountNumber}, function (err, user) {
    if (!data.hasOwnProperty('date') ||
      !data.hasOwnProperty('title') ||
      !data.hasOwnProperty('sender') ||
      !data.hasOwnProperty('amount')) {
      return callback('Transfer incomplete');
    }

    if (!user) {
      return callback('No users found');
    }

    for (var i = 0; i < user.transfers.length; i++) {
      if (user.transfers[i].date.toLocaleDateString() ===
        new Date(data.date).toLocaleDateString() &&
        user.transfers[i].title === data.title &&
        user.transfers[i].sender === data.sender &&
        user.transfers[i].amount === data.amount) {
        return callback('Transfer exists');
      }
    }

    user.transfers.push(data);
    user.save(function (err) {
      if (err) {
        callback(err);
      }
      callback(null, user);
    });
  });
};

var Users = mongoose.model('Users', userSchema);

module.exports = Users;
