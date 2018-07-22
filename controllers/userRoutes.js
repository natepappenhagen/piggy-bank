const express = require('express');
const router = express.Router();
const User = require('../models/users');

//index route
router.get('/', (req, res) => {
  res.render('../views/userViews/index.ejs');
});







module.exports = router;