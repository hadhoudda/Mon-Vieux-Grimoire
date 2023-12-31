const Book = require('../models/Book');
const fs = require('fs');
const DOMPurify = require("../config/dompurify"); //Package pour purifier les données dangereuse dans l'input

exports.createBook = async (req, res ) => {
	try {
        const bookObject = JSON.parse(req.body.book)    
		const cleanBookObject = {
			...bookObject,
            // Purification les champs input
            title: DOMPurify.sanitize(bookObject.title),
            author: DOMPurify.sanitize(bookObject.author),
            genre: DOMPurify.sanitize(bookObject.genre),
            userId: req.auth.userId,
			imageUrl: `${req.protocol}://${req.get("host")}/images/${ req.file.filename }`,
            ratings:[],
            averageRating:0
		}
        //Comparer l'objet nettoyé avec l'objet envoyé
        const book = new Book(cleanBookObject);
            if(
                cleanBookObject.title !== bookObject.title ||
                cleanBookObject.author !== bookObject.author ||
                cleanBookObject.genre !== bookObject.genre
            ){
                console.log("Détection de données dangereuses envoye par l'utilisateur :" + req.auth.userId);
                return res.status(400).json({ message: "Données dangereuses détectées STOP!"});
            }
        // Vérifier l'année de publication du livre 
        const today = new Date()
        const year = today.getFullYear()  
        if (bookObject.year > year){              
            return  res.status(400).json("Année de publication supperieur à la date actuelle.")
        }
		const result = await book.save()
		if(result){
			return res.status(201).json({ message: 'Livre enregistré !'})
		}
		res.status(401).json({ message: "enregistrement impossible!" });
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
        // Purification les données modifiées
        const cleanBookObject = {
            ...bookObject,
            title: DOMPurify.sanitize(bookObject.title),
            author: DOMPurify.sanitize(bookObject.author),
            genre: DOMPurify.sanitize(bookObject.genre),
        }
        if(
            cleanBookObject.title !== bookObject.title ||
            cleanBookObject.author !== bookObject.author ||
            cleanBookObject.genre !== bookObject.genre
        ){
            console.log("Détection de données dangereuses envoye par l'utilisateur :" + req.auth.userId);
            return res.status(400).json({ message: "Données dangereuses détectées STOP!"});
        }
        // Vérifier l'année de publication du livre 
        const today = new Date()
        const year = today.getFullYear()            
        if (bookObject.year > year){              
            return  res.status(400).json("Année de publication supperieur à la date actuelle.")
        }
        //Vérifier si l'utilisateur a le droit de modifier le livre ou non        
        const book = await Book.findOne({ _id: req.params.id })
        if (book.userId != req.auth.userId) {
            return res.status(401).json({ message: 'Not authorized' })
        }
        //Fonction de mise à jour du livre
        const up = async (bookObject, id) => {
            return await Book.updateOne({ _id: id }, { ...bookObject, _id: id });
        }  
        if (req.file) {
            const filename = book.imageUrl.split("/images/")[1];
            // Supprime l'ancienne image du livre du système de fichiers
            fs.unlink(`images/${filename}`, async (err) => {
            if (err)
                return res.status(400).json({ message: "suppression impossible !" });
            const bookUp = await up(bookObject, req.params.id);
            if (bookUp)
                return res.status(200).json({ message: "Livre modifié !" });
            else 
                return res.status(400).json({ message: "mise à jour impossible !" });
            });
        } else {
                // Mettre à jour le livre
                const bookUp = await up(bookObject, req.params.id);
                if (bookUp)
                    return res.status(200).json({ message: "Livre modifié !" });
                else
                    return res.status(400).json({ message: "mise à jour impossible !" });
            }
        } catch (error){ res.status(400).json({ error });
    }
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
            await Book.deleteOne({_id: req.params.id})
			res.status(200).json({message: 'Objet supprimé !'})
        }
		catch(error){res.status(400).json({ error })}
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
            return res.status(200).json(books)
        } 
        res.status(200).json({ message: "Pas de livres" });   
    }
    catch(error){res.status(404).json({ error })};
};