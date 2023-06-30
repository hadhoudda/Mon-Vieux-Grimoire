const express = require('express');
const bookCtrl = require('../controllers/book');
const auth = require ('../middleware/auth')
const multer = require ('../middleware/multer-config')
const sharp = require ('../middleware/sharp')
const router = express.Router();

// Route pour créer un nouveau livre
router.post('/', auth , multer ,sharp , bookCtrl.createBook);
// Route pour ajouter une évaluation à un livre
router.post('/:id/rating', auth , bookCtrl.creatRating)
//Route pour afficher l
router.get('/bestrating', bookCtrl.bestRating)
// Route pour modifier les informations d'un livre existant
router.put('/:id', auth , multer , sharp , bookCtrl.modifyBook);
// Route pour supprimer un livre existant
router.delete('/:id', auth , bookCtrl.deleteBook);
// Route pour obtenir les informations d'un livre spécifique
router.get('/:id' , bookCtrl.getOneBook);
// Route pour obtenir tous les livres
router.get('/', bookCtrl.getAllBook);

module.exports = router;