const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const socket = require('socket.io');
const mongoose = require('mongoose');
const users = require('./routes/Users');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

//mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/blobApp').then(()=>{
    console.log('Conectado ao MongoDB')
}).catch((err)=>{
    console.log('Erro ao conectar '+err)
})

app.use('/users', users)

const Port = 8081;
app.listen(Port, ()=>{
    console.log(`Servidor rodando na url: http://localhost:${Port}`)
});

module.exports = app;