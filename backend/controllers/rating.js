const Book = require('../models/Book');
 
 //ajouter une évaluation à un livre
exports.creatRating =  (req, res) => {
      console.log(req.params.id)
      console.log(req.auth.userId)
      // Vérifier si l'utilisateur a déjà ajouté une notation pour ce livre
      Book.findOne({ _id: req.params.id  })
            .then((book) => {
                  console.log(req.body.userId)
                  if (book && req.body.userId === req.auth.userId) {
                        return res.status(400).json({ message: "Vous avez déjà noté ce livre." });
                  }
            // Mettre à jour le livre avec la nouvelle note
            Book.findByIdAndUpdate({ _id: req.params.id  },  {
                  $push: {  //$push operator appends a specified value to an array.
                        ratings: {
                        userId: req.auth.userId,
                        grade: req.body.rating
                        }
                  }
            })
                  .then((book) => {
                  // Calculer la moyenne des notes
                  const averRati = book.averageRating
                  const totalRatings = book.ratings.length;
                  const sumNoteRates = book.ratings.reduce((total, rating) => total + rating.grade, 0);
                  averRati = sumNoteRates / totalRatings;
                  // Enregistrer les modifications
                  book.replaceOne({averageRating : {averRati}})
                  })
                  .catch((error) => res.status(400).json({ error }));
            })
              .catch((error) => res.status(400).json({ error }));
      }; 

exports.bestRating = (req  ,res, next) => {
      Book.find()
      .sort({ averageRating: -1 })  //Trie par ordre décroissant
      .limit(3) //afficher uniquement les 3 premiers
      .then((books) => {
            res.status(200).json(books);
      })
      .catch((error) => {
            res.status(400).json({ error });
      });
      }