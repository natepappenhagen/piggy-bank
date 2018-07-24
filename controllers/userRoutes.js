const express = require('express');
const router = express.Router();
const User = require('../models/users');
const CoinMarketData = require('../models/coinmarketcapData');

//==============================================
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







//===============================================================
//             Routes


/////                     CMC API TESTING                //
var CoinMarketCap = require("node-coinmarketcap");
var cmc = new CoinMarketCap();
// If you want to check a single coin, use get() (You need to supply the coinmarketcap id of the cryptocurrency, not the symbol)
// If you want to use symbols instead of id, use multi.
// cmc.get("bitcoin", coin => {
//   console.log(coin.price_usd); // Prints the price in USD of BTC at the moment.
// });
// If you want to check multiple coins, use multi():
// cmc.multi(coins => {
//   console.log(coins.get("BTC").price_usd); // Prints price of BTC in USD
//   console.log(coins.get("ETH").price_usd); // Print price of ETH in USD
//   console.log(coins.get("ETH").price_btc); // Print price of ETH in BTC
//   console.log(coins.getTop(10)); // Prints information about top 10 cryptocurrencies
// });



//=====================================================


//login or register route
router.get('/coin', (req, res) => {

  cmc.get("ethereum", coin => {

     res.render('../views/userViews/show.ejs', {
      coin: coin
     } );
//    res.send(coin.price_usd);
  })
});




//secret page(aka specific users profile page)
router.get('/coin', isLoggedIn, (req, res) => {
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

  cmc.multi(coins => {
    coins.getTop();

    res.render('../views/userViews/login.ejs', {
      coins: coins

  });


  });


});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/piggybank/portfolio',
  failureRedirect: '/piggybank/login'
}), (req, res) => {
});

//logout Routes
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/piggybank/login');
});



//=========================================================
//                  Coin Routes


router.get('/portfolio', isLoggedIn, (req, res) => {
  res.render('../views/userViews/show.ejs', {
    coin: CoinMarketData
  })
});

router.get('/portfolio/addcoin', isLoggedIn, (req, res) => {
  res.render('../views/transactionViews/new.ejs', {

  })
})






module.exports = router;
