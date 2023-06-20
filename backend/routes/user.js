const express = require('express');
const userCtrl = require('../controllers/user');
const checkMail = require('../middleware/checkMail');
const checkPassword = require ('../middleware/checkPassword');
const router = express.Router();

router.post('/signup', checkMail, checkPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;