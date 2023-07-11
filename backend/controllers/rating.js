const Book = require('../models/Book');
 
 //ajouter une évaluation à un livre
exports.creatRating = async (req, res) => {
      try{  
            // Vérifier si l'utilisateur est connecté
            if (req.body.userId != req.auth.userId) {
                  return res.status(401).json({ message: 'Non autorisé' })
            } 
            // Vérifier si l'utilisateur a déjà ajouté une notation pour ce livre
            const book = await Book.findOne({ _id: req.params.id  })
            if (book && book.ratings.find(bookId => bookId.userId === req.auth.userId)) {
                return res.status(400).json({ message: "Vous avez déjà noté ce livre." });
            }
            // Mettre à jour le livre avec la nouvelle note
            book.ratings.push({
                  userId : req.auth.userId,
                  grade :req.body.rating
            })
            // Calculer la moyenne des notes
            const totalRatings = book.ratings.length;
            const sumNoteRates = book.ratings.reduce((total, rating) => total + rating.grade, 0);
            const averageRating = sumNoteRates / totalRatings;
            // Enregistrer les modifications
            book.averageRating = averageRating
            await book.updateOne({ _id: req.params.id}, { book})
            await book.save()
            res.status(200).json(book)
      }
      catch(error){ res.status(400).json({ error })}
}

exports.bestRating = async(req  ,res) => {
      try{
            const books= await Book.find()
            .sort({ averageRating: -1 })  //Trie par ordre décroissant
            .limit(3) //afficher uniquement les 3 premiers
            res.status(200).json(books);
      }
      catch(error){ res.status(400).json({ error })}
}