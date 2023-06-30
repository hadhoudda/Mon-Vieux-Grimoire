const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = async (req, res) => {
  try { const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;     
    const book = new Book({
       ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${ req.file.filename }`, 
      });
  
      const result = await book.save()
      if(result){
        return res.status(201).json({ message: 'Livre enregistré !'})
      }
      throw new Errr('echec') //si ona pb de création pas besion d'explique l'erreur (fuite de données si on fait beacoup d'explication au frontend)
    }
  catch(error){ res.status(400).json({ error }) }


  // const bookObject = JSON.parse(req.body.book);
  // delete bookObject._id;
  // delete bookObject._userId;     
  // const book = new Book({
  //    ...bookObject,
  //   userId: req.auth.userId,
  //   imageUrl: `${req.protocol}://${req.get("host")}/images/${ req.file.filename }`, 
  //   });

  //   book.save()
  //     .then(() => res.status(201).json({ message: 'Livre enregistré !'}))
  //     .catch(error => res.status(400).json({ error }));
 };
    
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Livre modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
    };

exports.getAllBook =  (req, res, next) => {
  Book.find()
  .then((books) => {
    if (books === null) {
      res.status(204).json({ message: "Pas de livres" })
    } res.status(200).json(books)
  })
  .catch((error) => res.status(400).json({ error }));
  };
  
 // pour ajouter une évaluation à un livre
  exports.creatRating =  (req, res, next) => {
      const bookId = req.params.id;
      if (!bookId) {
        return res.status(400).json({ message: "L'identifiant du livre est manquant." });
      }
    
      // Vérifier si l'utilisateur a déjà ajouté une notation pour ce livre
      Book.findOne({ _id: bookId, "ratings.userId": req.auth.userId })
        .then((book) => {
          if (book) {
            return res.status(400).json({ message: "Vous avez déjà noté ce livre." });
          }
    
          // Mettre à jour le livre avec la nouvelle note
          Book.findByIdAndUpdate(bookId, {
            $push: {
              ratings: {
                userId: req.auth.userId,
                grade: req.body.rating
              }
            }
          }, { new: true })
            .then((book) => {
              if (!book) {
                return res.status(404).json({ message: "Le livre n'existe pas." });
              }
    
              // Calculer la moyenne des notes
              const totalRatings = book.ratings.length;
    
              const sumRates = book.ratings.reduce((total, rating) => total + rating.grade, 0);
              book.averageRating = sumRates / totalRatings;
    
              // Enregistrer les modifications
              book.save().then((book) => {
                res.status(200).json(book, { message: "Notation enregistrée " });
              });
            })
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(400).json({ error }));
    }; 


  exports.bestRating = (req  ,res, next) => {
    
  }