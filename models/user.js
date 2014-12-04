var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: String
});

var Users = mongoose.model('Users', userSchema);
module.exports = Users;
