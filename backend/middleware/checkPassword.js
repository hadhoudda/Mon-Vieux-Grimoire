const passwordValidator = require('password-validator');

module.exports = (red , res, next) =>{
      console.log('password ok')
      next()
      
}