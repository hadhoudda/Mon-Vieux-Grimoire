
const express = require('express');
const router = express.Router();
const checkMail = require('../middleware/checkMail');
//const checkPassword = require ('../middleware/checkPassword');

const userCtrl = require('../controllers/user');

router.post('/signup', checkMail, userCtrl.signup);// middlewvre verifie mail et mot de passe   checkMail,checkPassword,
router.post('/login', userCtrl.login);

module.exports = router;