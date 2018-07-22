const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

mongoose.connect("mongodb://localhost/hash-demo-googleAUTH");

mongoose.connection.on('connected', ()=>{
    console.log("MONGOOSE ACTIVE")
})
mongoose.connection.on('error', (err) => {
    console.log(err, 'mongoose error');
  });
mongoose.connection.on('disconnected', () => {
console.log('mongoose is disconnected');
});

const models_path = path.join(__dirname, './../models');

fs.readdirSync(models_path).forEach(function(file){
    if(file.indexOf('.js') >= 0) {
        require(models_path + '/' + file);
    }
})