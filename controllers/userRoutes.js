const express = require('express');
const router = express.Router();
const User = require('../models/users');

//==============================
//      passport set up
const passport = require('passport');
const LocalStrategy = require('passport-local');

router.use(require('express-session')({
  secret: 'fuck yo bitch slutty',
  resave: false,
  saveUnintialized: false
}));
router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/piggybank/login');
}


//========================================
//             Routes


//login or register route
router.get('/', (req, res) => {
  res.render('../views/userViews/index.ejs');
});

//secret page(aka specific users profile page)
router.get('/secret', isLoggedIn, (req, res) => {
  res.render('../views/userViews/show.ejs');
});
//add new users
router.get('/register', (req, res) => {
  res.render('../views/userViews/new.ejs');
});

router.post('/register', (req, res) => {
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      console.log(err, 'err in create new user');
      return res.render('../views/userViews/new.ejs')
    } else {
      passport.authenticate('local')(req, res, (err) => {
        if(err){
          console.log(err, 'error in authenticate');
        } else {
          res.render('../views/userViews/show.ejs')
        }
      });
    }
  });
});

//Login Routes
router.get('/login', (req, res) => {
  res.render('../views/userViews/login.ejs')
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/piggybank/secret',
  failureRedirect: '/piggybank/login'
}), (req, res) => {
});

//logout Routes
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/piggybank/login');
});


//edit users

//delete users




module.exports = router;
