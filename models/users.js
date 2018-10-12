const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Holding = require('./holdings.js');

const UserSchema = new mongoose.Schema({
  fame: String,
  username: String,
  password: String,
  portfolio: [Holding.schema],

});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);