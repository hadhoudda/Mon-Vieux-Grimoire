const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require("dotenv").config(); 

exports.signup = async(req, res, next) => {
    try{
        const hash = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            email: req.body.email,
            password: hash
        });
        await user.save()
        res.status(201).json({ message: 'Utilisateur créé !' })
    }
    catch(error){ res.status(400).json({ error })}
};

exports.login = async (req, res, next) => {
    try{
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        try{
            const valid = await bcrypt.compare(req.body.password, user.password)
        if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                { userId: user._id },
                process.env.KEY ,
                { expiresIn: '24h' }
                )
            });
        }
        catch(error){ res.status(500).json({ error })}
    }
    catch(error){ res.status(400).json({ error })}
   }; 
    