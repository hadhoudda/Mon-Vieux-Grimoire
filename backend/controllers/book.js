const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = async (req, res ) => {
	try {const bookObject = JSON.parse(req.body.book)
        console.log(bookObject)   
		const book = new Book({
			 ...bookObject,
			userId: req.auth.userId,
			imageUrl: `${req.protocol}://${req.get("host")}/images/${ req.file.filename }`,
            ratings: [],
            averageRating :0
			});
            // Vérifier l'année de publication du livre 
            const today = new Date()
            const year = today.getFullYear()            
            if (bookObject.year > year) {              
                return  res.status(400).json("Année de publication supperieur à la date actuelle.")
            }
			const result = await book.save()
			if(result){
				return res.status(201).json({ message: 'Livre enregistré !'})
			}
			throw new Errr('echec')
		}
	catch(error){ res.status(400).json({ error })}
};
		
exports.modifyBook = async (req, res) => {
	try{
        // Vérifie si existe une image à la requête
        const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body }
        // Vérifier l'année de publication du livre 
        const today = new Date()
        const year = today.getFullYear()            
        if (bookObject.year > year) {              
            return  res.status(400).json("Année de publication supperieur à la date actuelle.")
        }
        //supprime l'ancienne image du système de fichiers
        ////////////////////////////////////////
        delete bookObject._userId;
        const bookUser = await Book.findOne({_id: req.params.id})
        //Vérifier est ce que l'utilisateur a le droit de modification ou non
        if (bookUser.userId != req.auth.userId) {
            return res.status(401).json({ message : 'Not authorized'})
        }
        const book = await Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
        res.status(200).json({message : 'Livre modifié!'})
        }
    catch(error){res.status(400).json({ error })}
};

exports.deleteBook = async(req, res , next) => {
    try{
        const book = await Book.findOne({ _id: req.params.id})
		if (book.userId != req.auth.userId) {
				return res.status(401).json({message: 'Not authorized'});
			}
		const filename = book.imageUrl.split('/images/')[1];
		fs.unlink(`images/${filename}`, async() => {
		try{
            const book = await Book.deleteOne({_id: req.params.id})
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