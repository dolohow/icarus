'use strict';
var mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
  email: String,


});

var Users = mongoose.model('Users', usersSchema);
module.exports = Users;
