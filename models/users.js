const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Coin = require('./coins.js');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  // portfolio: [Coin.schema],

});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
