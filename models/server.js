var mongoose = require('mongoose');

var serverSchema = new mongoose.Schema({
  hostname: {type: String, required: true, index: {unique: true}},
  capacity: Number,
  link: Number,
  price: Number
});

var Servers = mongoose.model('Servers', serverSchema);
module.exports = Servers;
