const sharp = require ('sharp')
const path = require("path")
const fs = require('fs')

module.exports= (req, res, next) => {
      if(req.file){
            console.log(req.file)
            //change type d'image en webp
            const newFileName = req.file.filename.split(".")[0]
            req.file.filename = newFileName + ".webp"
            console.log(req.file.filename)
            //compresse image 
            //sharp(req.file.path).resize(300).toFile()       
            console.log(req.file)
            //supprime l'image non compresse
            fs.unlinkSync(req.file.path)

      }
      
      next()
}