const passwordValidator = require('password-validator');

const passwordschema = new passwordValidator();
passwordschema
    .is().min(8)                                    // Minimum length 8
    .is().max(20)                                   // Maximum length 20
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(1)                                // Must have at least 1 digits
    .has().not().spaces()                           // Should not have spaces

module.exports = (req , res, next) =>{
    console.log('password is ' + passwordschema.validate(req.body.password))
    if(passwordschema.validate(req.body.password)){
        next()
    } else {
        return res.status(400).json({error : `le mot de passe n'est pas assez fort: ${passwordschema.validate('req.body.password' , { list: true })}`})
    }
}