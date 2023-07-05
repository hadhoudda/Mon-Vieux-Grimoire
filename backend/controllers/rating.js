const Book = require('../models/Book');
 
 //ajouter une évaluation à un livre
exports.creatRating = async (req, res) => {
      try{
            console.log(req.params.id)
            console.log(req.auth.userId)
            // Vérifier si l'utilisateur est connecté
            if (req.body.userId !== req.auth.userId) {
                  return res.status(401).json({ message: 'Non autorisé' })
            } 
            // Vérifier si l'utilisateur a déjà ajouté une notation pour ce livre
            const bookRate = await Book.findOne({ _id: req.params.id  })
            console.log(req.body.userId)
            if (bookRate && req.body.userId === req.auth.userId) {
                return res.status(400).json({ message: "Vous avez déjà noté ce livre." });
            }
            // Mettre à jour le livre avec la nouvelle note
            const book = await Book.findByIdAndUpdate({ _id: req.params.id  },  {
                  $push: {  //$push operator appends a specified value to an array.
                        ratings: {
                        userId: req.auth.userId,
                        grade: req.body.rating
                        }
                  }
            })
            // Calculer la moyenne des notes
            const averRati = book.averageRating
            const totalRatings = book.ratings.length;
            const sumNoteRates = book.ratings.reduce((total, rating) => total + rating.grade, 0);
            averRati = sumNoteRates / totalRatings;
            // Enregistrer les modifications
            book.replaceOne({averageRating : {averRati}})            
      }
    catch(error){ res.status(400).json({ error })}
}

exports.bestRating = async(req  ,res, next) => {
      try{
            const books= await Book.find()
            .sort({ averageRating: -1 })  //Trie par ordre décroissant
            .limit(3) //afficher uniquement les 3 premiers
            res.status(200).json(books);
      }
      catch(error){ res.status(400).json({ error })}
}