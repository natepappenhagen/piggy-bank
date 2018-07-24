const mongoose = require('mongoose');
const Holding = require('./holdings.js');

const CoinSchema = new mongoose.Schema({

  holdings: [Holding.schema],

});



module.exports = mongoose.model('Coin', CoinSchema);
