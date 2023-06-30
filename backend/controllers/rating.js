const Book = require('../models/Book');
 
 
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