const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    seatNumber: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Booking = mongoose.model("Booking",bookingSchema);
module.exports = Booking;
