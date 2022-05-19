const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const date = new Date()

const Chat = new Schema({
    message: {
        type: String
    },
    name: {
        type: String
    },
    group: {
        type: String
    },
    time: {
        type: Date,
        default: date
    }
});

mongoose.model('chat', Chat);