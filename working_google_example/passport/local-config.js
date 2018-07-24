var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy(
	function(username, password, done) {
		console.log(`inside the strategy trying to login ${username} with ${password}`)


		User.findOne({ username: username},function(err,user) {
			console.log(`successfully found ${user.username}`)
			if (err) {return done(err); }
			if (!user) {
				return done(null, false, {message: 'incorrect username.'});

			}
			if (!user.ValidPassword(password)) {
				return done (null, false, {message: 'incorrect password.'});
			}
			console.log("EVERYTHING WORKED")
			return done(null, user);
		});
		}
	));