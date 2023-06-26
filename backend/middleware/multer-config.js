const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const storage = multer.diskStorage({ //ou on mettre le fichier
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
        const namepop = name.split(".");
        namepop.pop();
        const namePoint = namepop.join(".");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, namePoint + Date.now() + "." + extension);
  }
});

module.exports = multer({storage: storage}).single('image');