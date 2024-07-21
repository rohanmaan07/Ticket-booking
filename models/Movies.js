const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    actors: {
        type: String,
        required: true,
    },
    url: {
        url:String,
        filename:String,

    },
    releaseDate: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
