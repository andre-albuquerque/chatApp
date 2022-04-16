const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Room = new Schema({
    room: {
        type: String,
        required: true
    }
})

mongoose.model('room', Room);