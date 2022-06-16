const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Room = new Schema({
    room: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('room', Room);