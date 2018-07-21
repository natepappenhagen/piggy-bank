const express = require('express');
const router = express.Router();
const User = require('../models/users');

//index route
router.get('/', (req, res) => {
  res.render('../views/userViews/index.ejs');
});

router.get('/register', (req, res) => {
  res.render('../views/userViews/new.ejs');
});






module.exports = router;
