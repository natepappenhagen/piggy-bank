const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Holding = require('../models/holdings');
const CoinMarketData = require('../models/coinmarketcapData');
const request = require('request');



//==============================================
//      passport set up
const passport = require('passport');
const LocalStrategy = require('passport-local');

router.use(require('express-session')({
  secret: 'choochoocoming',
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


//Index route
router.get("/", (req, res) => {
  User.find({}, (err, foundUsers) => {
    if(err){
      console.log('error in find');
      console.log(err);
    } else {
      res.render('../views/userViews/index.ejs', {users: foundUsers});
    }
  });
});


//login or register route
//===========================Login Routes


router.get('/login', (req, res) => {
  // request('https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,DASH&tsyms=BTC,USD,EUR', (error, response, body) => {
  request('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,LTC,XRP,XLM,USDT,ETH,IOTA,EOS,BCH,ADA&tsyms=USD', (error, response, body) => {
    if(!error && response.statusCode == 200){
      let coinData = JSON.parse(body);

      res.render('../views/userViews/login.ejs', {
        coinData: coinData
      });
    }
  });
});


//add new users
router.get('/new', (req, res) => {
  res.render('../views/userViews/new.ejs');
});

router.post('/', (req, res) => {
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      return res.render('../views/userViews/new.ejs')
    } else {
      passport.authenticate('local')(req, res, (err) => {
        if(err){
          console.log(err, 'error in authenticate');
        } else {
          res.redirect(`/piggybank/${user.id}/portfolio`);
        }
      });
    }
  });
});

router.get('/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if(err){
      console.log(err, 'error in show');
      res.send(err);
    } else {
      console.log(req.params.id);
      res.render('../views/userViews/user.ejs', {
        user: user,
      });
    }

  })
});

router.get('/:id/portfolio', isLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if(err){
        console.log(err, 'error in show');
        res.send(err);
      } else {
        console.log(user, 'users');
          User.find({ '_id': user.id }, 'portfolio', (err, foundHoldings) => {
            if(err){
              console.log('error in find');
              console.log(err);
            } else {
                let fHoldings = foundHoldings[0].portfolio;
                console.log(fHoldings);
                res.render('../views/userViews/show.ejs', {
                  user: user,
                  holdings: fHoldings,
                });
              }
            });
          }
        });
      });


//=========================================================
//                  Coin Routes



//===========================================================
//                add coins with search bar

router.get('/:id/portfolio/addcoin', isLoggedIn, (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if(err){
      console.log(err, 'error in show');
      res.send(err);
    } else {
      console.log(req.params.id);
      res.render('../views/transactionViews/new.ejs', {
        user: user,
      });
    }

  })

});

//Create route
router.post('/:id/portfolio', isLoggedIn, (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if(err){
      console.log(err, 'error in show');
      res.send(err);
    } else {
      Holding.create(req.body, (err, newHolding) => {
        if(err){
          console.log(err, 'error in create');
          res.render('../views/transactionViews/new.ejs');
        } else {
          console.log(newHolding);
          user.portfolio.push(newHolding);
          user.save();
          res.redirect(`/piggybank/${user.id}/portfolio`);
        }
      });

    }

  })
});

//Show route
router.get('/:id/portfolio/:holdingID', isLoggedIn, (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if(err){
      console.log(err, 'error');
    } else {
      console.log(user, 'user');
      console.log(user.portfolio);

      let userID = user["_id"];
      let id = user.portfolio;

      for (let i = 0; i < id.length; i++){
        console.log(id[i], 'this id i');
        console.log(req.params.holdingID, 'holding id');
        let holding_id = id[i]["_id"];
        let hold = id[i]["numOfHoldings"];
        let cost = id[i]["cost"];
        let sym = id[i]["symbol"];
        console.log(sym);

        if (holding_id == req.params.holdingID) {
          User.find({"_id": req.params.holdingID}, (err, holding) => {
                  if(err){
                    console.log(err, 'error in show');
                  } else {
                    console.log(holding, 'holding');
                    request('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + sym + '&tsyms=USD', (error, response, body) => {

                      if(!error && response.statusCode == 200){
                        let coinData = JSON.parse(body);
                        res.render('../views/transactionViews/show.ejs', {
                          userID: userID,
                          coinData: coinData,
                          hold: hold,
                          cost: cost,
                          sym: sym,
                          holdingid: holding_id,
                        });
                      }
                    });
                  }
                });
              }
            }
          }
        });
      });


//==========================================================
//             edit and delete transaction

router.delete('/:id/portfolio/:holdingID', (req, res) => {
    User.findByIdAndRemove({"_id": req.params.holdingID}, (err) => {
        if(err){
          console.log(err, 'error in show');
        } else {
          console.log(req.params.holdingID, 'it worked');
          res.redirect(`/piggybank/${req.params.id}/portfolio`);
          // let portfolioArray = id[0]["portfolio"];
          // console.log(portfolioArray, 'this portfolioArray');
          // console.log(id[0].portfolio[0]["_id"], 'THIS IS THE ID FOR transaction');
          // let userID = id[0].portfolio;
          // console.log(userID, 'user id');
          // console.log('delete request made');
          //
          // let transactionID = id[0].portfolio[0]["_id"];
          //
          // portfolioArray.splice(0, 1);
          // res.redirect(`/piggybank/${req.params.id}/portfolio`);
        }
      });
    });
//       } else {
//         console.log('delete request made');
//         res.redirect(`/piggybank/${req.params.id}/portfolio`)
//       }
//     })
//   })
//
// })



router.post('/login', passport.authenticate('local'), (req, res) => {
  User.findById(req.body.id, (err, id) => {
    if (err) {
      console.log(err, 'error');
    } else {
      console.log(req.user._id);
      res.redirect(`/piggybank/${req.user._id}/portfolio`)
    }
  });

});

//logout Routes
router.get('/:id/logout', (req, res) => {
  req.logout();
  res.redirect('/piggybank/login');
});

module.exports = router;