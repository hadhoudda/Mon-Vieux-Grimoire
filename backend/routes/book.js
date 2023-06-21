const express = require('express');
const bookCtrl = require('../controllers/book');
const auth = require ('../middleware/auth')
const multer = require ('../middleware/multer-config')
const router = express.Router();

// Route pour obtenir tous les livres
router.get('/', bookCtrl.getAllBook);
// Route pour obtenir les informations d'un livre spécifique
router.get('/:id' , bookCtrl.getOneBook);
// Route pour créer un nouveau livre
router.post('/', auth , multer , bookCtrl.createBook);
// Route pour mettre à jour les informations d'un livre existant
router.put('/:id', auth , multer , bookCtrl.modifyBook);
// Route pour supprimer un livre existant
router.delete('/:id', auth , bookCtrl.deleteBook);
// Route pour ajouter une évaluation à un livre
router.post('/:id/rating', auth , bookCtrl.creatRating)

module.exports = router;