const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bookRoutes = require('./routes/book')
const userRoutes = require('./routes/user')
app.use(express.json());
const path = require('path');
require("dotenv").config();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect('mongodb+srv://houda:houda83@cluster0.bugaclq.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')));
module.exports = app;