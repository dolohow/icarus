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

userSchema.statics.addTransfer = function (transfer, callback) {
  callback = (typeof callback === 'function') ? callback : function () {};
  if (!transfer.date || typeof transfer.title === undefined ||
      !transfer.sender || !transfer.accountNumber || !transfer.amount) {
    return process.nextTick(function () {
      callback(new Error('Transfer incomplete'));
    });
  }
  this.findOne({accountNumbers: transfer.accountNumber}, function (err, user) {
    if (!user) {
      return callback(new Error('No users found'));
    }
    for (var i = 0; i < user.transfers.length; i++) {
      if (user.transfers[i].date.toLocaleDateString() ===
          new Date(transfer.date).toLocaleDateString() &&
            user.transfers[i].title === transfer.title &&
              user.transfers[i].sender === transfer.sender &&
                user.transfers[i].amount === transfer.amount) {
        return callback(new Error('Transfer exists'));
      }
    }
    user.transfers.push(transfer);
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
