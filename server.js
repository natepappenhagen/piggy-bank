const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const port = process.env.Port || 3000;
require('./db/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

const User = require('./models/users');
const userRoutes = require('./controllers/userRoutes');


app.get('/', (req, res) => {
  res.redirect('/piggybank/')
});

app.use('/piggybank/', userRoutes);






app.listen(port, () => {
    console.log('listening on port' + port)
});