const validator = require("validator");

module.exports = (req , res, next) =>{
      const {email} = req.body;
      console.log('email is ' + validator.isEmail(email))
      if (validator.isEmail(email)){
            next()
      } else {
            return res.status(400).json({error : `l'email ${email} n'est pas validé `})
      }
      
}