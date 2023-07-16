const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const path = require('path'); // Package qui gère le chemin des fichier
const helmet = require('helmet'); //Package qui aide à sécuriser les applications Express en définissant des en-têtes de réponse HTTP
const limiter = require('./config/rate-limit'); //Package qui Verifier les limites Requêtes / SERVEUR
const mongoSanitize = require('express-mongo-sanitize'); //Package qui remplace tout caractère interdit
require("dotenv").config(); //Fichier cacher des données sensibles

app.use(express.json());

//********** Gérer les problèmes de cors **********//
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//********** Utilisation de middleware Helmet  **********//  
app.use(helmet());
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin",
    })
);

//********** Vérification des limites Requêtes / SERVEUR **********//
app.use(limiter);

mongoose.connect(process.env.DBLINK,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

//********** remplacer les caractères interdits par _ **********//
app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);
//********** Routes books **********//
app.use('/api/books', bookRoutes)

//********** Routes authentification **********//
app.use('/api/auth', userRoutes)

//********** Routes lecture des images **********//
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;