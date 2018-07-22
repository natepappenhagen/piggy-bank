/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Coin = mongoose.model('coin');
const {ensureAuthenticated, ensureGuest} = require('../config/auth');

router.get('/', ensureGuest, (req, res)=> {
    res.render('hallo');
});

router.get('/success', ensureAuthenticated, (req, res)=> {
res.render('you made it');
});

router.get('/about', (req, res)=> {
    res.render('about');
});

module.exports = router;



