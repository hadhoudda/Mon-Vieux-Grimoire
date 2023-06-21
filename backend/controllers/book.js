const Book = require('../models/Book');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._Id;
  delete bookObject._userId;     
  const book = new Book({
     ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${ req.file.filename }`,    
    });
    book.save()
      .then(() => res.status(201).json({ message: 'Livre enregistré !'}))
      .catch(error => res.status(400).json({ error }));
 };
    

exports.modifyBook = (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !'}))
    .catch(error => res.status(400).json({ error }));
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
    const ratings = new Book({
      ...req.body.ratings
    });
    ratings.save()
    .then(() => res.status(201).json({ message: 'Note enregistré !'}))
    .catch(error => res.status(400).json({ error }));

  }