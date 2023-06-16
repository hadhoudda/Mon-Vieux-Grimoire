const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());
mongoose.connect('mongodb+srv://houda:houda83@cluster0.bugaclq.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      next();
    });

app.post('/api/stuff', (req, res, next) => {
      console.log(req.body);
      res.status(201).json({
        message: 'Objet créé !'
      });
    });

app.get('/api/stuff', (req, res, next) => {
      const stuff = [
        {
          _id: 'oeihfzeoi',
          title: 'Mon premier objet',
          description: 'Les infos de mon premier objet',
          imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
          price: 4900,
          userId: 'qsomihvqios',
        },
        {
            userId : 'ohuytdre',
            title : 'titre du livre',
            author : 'auteur du livre',
            imageUrl : 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            year: 2012,
            genre: 'String - genre du livre'
        },
      ];
      res.status(200).json(stuff);
    });

module.exports = app;