var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy({
	clientID:"1096977822951-pqah0grlilchj3ob7g68a81rn827k8de.apps.googleusercontent.com",
	clientSecret:"whzYAc-jV76K2LgKkSntR9mu",
	callbackURL:"http://localhost:3000/auth/google/callback",
},



function(accesstoken, refreshToken, profile, done) {
	console.log("____THIS IS GOOGLE PROFILE")
	console.log(profile)
	User.findOrCreate({ googleId: profile.id, displayName: profile.displayName}, function(err,user){
		return done(err,user);
	});
}


));





// {"web":
// 	{"client_id":"1096977822951-pqah0grlilchj3ob7g68a81rn827k8de.apps.googleusercontent.com",
// 	"project_id":"ninth-expanse-210913",
// 	"auth_uri":"https://accounts.google.com/o/oauth2/auth",
// 	"token_uri":"https://accounts.google.com/o/oauth2/token",
// 	"auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
// 	"client_secret":"whzYAc-jV76K2LgKkSntR9mu",
// 	"redirect_uris":["https://github.com/gasparrobi/node-google-oauth2-jwt.git"],
// 	"javascript_origins":["http://localhost:3000"]}}