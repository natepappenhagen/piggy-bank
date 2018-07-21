const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');


require('./db/db');

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

const User = require('./models/users');
const userRoutes = require('./controllers/userRoutes');

app.use('/piggybank', userRoutes);

app.use(require('express-session')({
  secret: 'fuck yo bitch slutty',
  resave: false,
  saveUnintialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.listen(3000, () => {
    console.log('i am watching....')
});
