const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = async (req, res) => {
	try {const bookObject = JSON.parse(req.body.book);
		delete bookObject._id;
		delete bookObject._userId;     
		const book = new Book({
			 ...bookObject,
			userId: req.auth.userId,
			imageUrl: `${req.protocol}://${req.get("host")}/images/${ req.file.filename }` 
			});
			const result = await book.save()
			if(result){
				return res.status(201).json({ message: 'Livre enregistré !'})
			}
			throw new Errr('echec') //si ona pb de création pas besion d'explique l'erreur (fuite de données si on fait beacoup d'explication au frontend)
		}
	catch(error){ res.status(400).json({ error })}
};
		
exports.modifyBook = async (req, res) => {
	try{
        const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
        delete bookObject._userId;
        const book = await Book.findOne({_id: req.params.id})
        if (book.userId === req.auth.userId) {
            Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
            res.status(200).json({message : 'Livre modifié!'})
        }
        throw new Errr(`${res.status(401).json({ error })}`)
    }
    catch(error){res.status(400).json({ error })}
};

exports.deleteBook = async(req, res) => {
    try{
        const book = await Book.findOne({ _id: req.params.id})
		if (book.userId != req.auth.userId) {
				return res.status(401).json({message: 'Not authorized'});
			}
		const filename = book.imageUrl.split('/images/')[1];
		fs.unlink(`images/${filename}`, async() => {
		try{
            Book.deleteOne({_id: req.params.id})
			res.status(200).json({message: 'Objet supprimé !'})
        }
		catch(error){res.status(401).json({ error })}
        })
	}
    catch( error){res.status(400).json({ error })}  
};          

exports.getOneBook = async (req, res) => {
    try{
        const book = await Book.findOne({ _id: req.params.id })
        res.status(200).json(book)
    }
    catch(error){res.status(404).json({ error })};
};

exports.getAllBook = async (req,res) => {
    try{
        const books = await Book.find()
        if(books != null){
           res.status(200).json(books)
        } 
        throw new Errr('Pas de livres')    
    }
	catch(error) {res.status(400)} //res.status(400).json(error);
};