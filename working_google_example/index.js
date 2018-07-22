var express = require("express");
var path = require("path");
var app = express();
const session = require('express-session')
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const morgan = require('morgan');
const passport = require('passport');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "./static")));
app.use(express.static(__dirname + '/front/dist'));
app.use(session({
    secret: "keepitsecretkeepitsafe",
    saveUninitialized: false
}))
app.use(morgan('short'));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
require('./db/db');
require('./passport/serializing');
require('./passport/local-config');
require('./passport/google-config');

const User = require('./models/user');
app.get('/', (req, res)=>{
    let message = ""
    if(req.session.message){
        message = req.session.message
    }
    res.render('index.ejs', {message: message})
});

app.post('/register', async (req, res)=>{
    try {
        await User.create(req.body)
        res.redirect('/success')
    } catch (err) {
        console.log(err)
        req.session.message = err.message
        res.redirect('/')
    }
 
    
})

app.post('/login', async (req, res, next)=>{
    console.log('trying to login')
    console.log(req.body);
    const passportCallback = passport.authenticate('local', { successRedirect: '/success',
                                failureRedirect:'/'})

    passportCallback(req,res, next)
    // const userTryingToLogIn = await User.findOne({username: req.body.username})
    // if(!userTryingToLogIn){
    //     await bcrypt.compare("bananas", "applesauce");
    //     req.session.message = "WRONG CREDENTIALS PAL"
    //     res.redirect("/")
    // } else {
    //     const validLogin = await bcrypt.compare(req.body.password, userTryingToLogIn.password)
    //     if(!validLogin){
    //         req.session.message = "WRONG CREDENTIALS PAL"
    //         res.redirect("/")
    //     } else {
    //         res.redirect('/success')
    //     }
    // }
})

app.get('/success', (req, res)=>{
    if(!req.user){
        res.redirect("/")
    }
    console.log("HERE IS THE LOGGED IN USER")
    console.log(req.user);
    res.send(`good job ${req.user.username}`)

})

app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
})

app.get('/auth/google',
  passport.authenticate('google', { scope:
    [ 'https://www.googleapis.com/auth/plus.login'] }
));


app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect:'/login'}),
    function (req, res) {
        console.log("successful google login")
        console.log(req.user)
    res.redirect('/')
});

app.listen(3000, () => {
    console.log("APP IS GO")
})