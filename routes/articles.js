/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated, ensureGuest} = require('../config/auth');

const Coin = mongoose.model('coin');
const User = mongoose.model('users');

//Index articles
router.get('/', (req, res)=> {
    res.send('index route');

});

//Show single article
router.get('/show/:id', (req, res)=> {
    res.send('show route by id');
});

//List user articles
router.get('/user/:userId', (req, res) => {
    res.send("user articles get route");

});

//Logged in users articles
router.get('/mycoins', ensureAuthenticated, (req, res) => {
    res.send("users coins");

});

//Add articles form
router.get('/add', ensureAuthenticated, (req, res)=> {
    res.send("add coins get route");
});

//Edit article form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    res.send("edit coins page");
});

//Process add artilcle
router.post('/',(req, res)=>{
    res.send("post route for index page.. create new coins here");
});

//Edit form process
router.put('/:id', ensureAuthenticated, (req, res)=> {
    res.send("update route");
});

//Delete article
router.delete('/:id', (req, res)=> {
    res.send("delete route");
});

//Add comment
router.post('/coin/:id', (req, res) => {
    res.send("add a comment route");

});

module.exports = router;