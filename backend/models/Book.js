const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
      title : { type: String, required: true },
      author : { type: String, required: true },
      imageUrl : { type: String, required: true },
      year: { type: Number, required: true },//année de publication du livre
      genre: { type: String, required: true },
      ratings : [
            {
                  grade : { type: Number, required: true },//notes données à un livre
            }
      ],
      averageRating : { type: Number, required: true }//note moyenne du livre

});

module.exports = mongoose.model('Thing', bookSchema);