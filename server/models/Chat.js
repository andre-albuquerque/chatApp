const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        default: Date.now
    }
});

mongoose.model('chat', Chat);