var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  user: {type: String, required: true, index: {unique: true}}
});

var Users = mongoose.model('Users', userSchema);
module.exports = Users;
