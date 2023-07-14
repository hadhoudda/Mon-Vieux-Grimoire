const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bookRoutes = require('./routes/book')
const userRoutes = require('./routes/user')
const path = require('path');// Package qui gère le chemin des fichier
const helmet = require('helmet')
const limiter = require('./config/rate-limit')
const mongoSanitize = require('express-mongo-sanitize');//remplace tout caractere interdit
//const cookieParser = require('cookie-parser')//Package qui gere les cookies
require("dotenv").config();//fichier cacher données sensibles

app.use(express.json());

//****** gérer les problèmes de cors *******//
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
//************ Utilisation de middleware Helmet  *************//  
app.use(helmet());
app.use(
  helmet.crossOriginResourcePolicy({//same-site
    policy: "cross-origin",//d'autre site de meme port (origine)//accepte origine diff
  })
);
// ************ Vérification des limites Requêtes / SERVEUR ************//
app.use(limiter);
///////////
//********** Récuperer la data encodé sous Cookies ************//
// app.use(cookieParser());

mongoose.connect(process.env.DBLINK,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
/////
app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')));
module.exports = app;