const sharp = require ('sharp')
const path = require("path")
const fs = require('fs')

module.exports= async (req, res, next) => {
    if(req.file){
        //Changer le type d'image en webp
        const newFileName = req.file.filename.split(".")[0]
        req.file.filename = newFileName + ".webp"
        const newName =newFileName + ".webp"
        // Compresser l'image
        await sharp(req.file.path).resize(400).toFile(path.resolve(req.file.destination, newName))
        fs.unlinkSync(req.file.path)
    }      
    next()
}