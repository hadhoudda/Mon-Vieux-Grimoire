const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true , unique: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
      },
    },
  ],
  averageRating: { type: Number, default: 0 },
});

module.exports = mongoose.model("Book", bookSchema);