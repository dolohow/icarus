var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: {unique: true}
  },
  gg: Number,
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

var Users = mongoose.model('Users', userSchema);
module.exports = Users;
