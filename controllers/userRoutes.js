const express = require('express');
const router = express.Router();
const User = require('../models/users');
const passport = require('passport');
const LocalStrategy = require('passport-local');
//passport set up
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


//========================================
//             Routes


//login or register route
router.get('/', (req, res) => {
  res.render('../views/userViews/index.ejs');
});

//add new users
router.get('/register', (req, res) => {
  res.render('../views/userViews/new.ejs');
});

router.post('/register', (req, res) => {
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      console.log(newUser);
      console.log(req.body);
      console.log(req.body.password);
      console.log(user);
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

//edit users

//delete users






module.exports = router;