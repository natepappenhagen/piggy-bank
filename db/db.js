const mongoose = require('mongoose');
const mongodb = process.env.MONGODB_URI || 'localhost';
mongoose.connect(process.env.NODE_ENV)
mongoose.connection.on("connected", () => {
  console.log("connected to database");
});
mongoose.connection.on("error", (err) => {
  console.log("error");
});
mongoose.connection.on("disconnected", () => {
  console.log("disconnected");
});