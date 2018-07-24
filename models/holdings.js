const mongoose = require('mongoose');

const HoldingSchema = new mongoose.Schema({
  // marketPriceUSD: Number,
  // cost: Number
  // numOfHoldings: String,
  // date: date,
});

module.exports = mongoose.model('Holding', HoldingSchema);
