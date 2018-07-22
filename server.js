const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

require('./db/db');

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static('public'));


const userRoutes = require('./controllers/userRoutes');

app.use('/login', userRoutes);

app.listen(3000, (err) => {
  if(err){
    console.log(err, 'error in listen');
  }else {
    console.log('i am watching....')
  }
});