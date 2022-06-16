const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let date = new Date();

const Room = new Schema({
    room: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: date
    }
})

mongoose.model('room', Room);