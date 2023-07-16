const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true }, // identifiant MongoDB unique de l'utilisateur qui a créé le livre
    title: { type: String, required: true ,maxlength: 50 }, // titre du livre
    author: { type: String, required: true ,maxlength: 50 }, // auteur du livre
    imageUrl: { type: String, required: true }, // couverture du livre
    year: { type: Number, required: true }, // année de publication du livre
    genre: { type: String, required: true }, // genre du livre
    ratings: [ // notes données à un livre
        {
        userId: { type: String, required: true }, // identifiant MongoDB unique de l'utilisateur qui a noté le livre
        grade: { // note donnée à un livre
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },
        },
    ],
    averageRating: { type: Number, default: 0 }, // note moyenne du livre
});

module.exports = mongoose.model("Book", bookSchema);