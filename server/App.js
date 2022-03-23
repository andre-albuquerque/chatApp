const dotenv = require('dotenv');
dotenv.config({ path: ".env" });

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const socket = require('socket.io');
const users = require('./routes/Users');
const connectDatabase = require('./config/Database');
const cors = require('cors');

app.use(express.json());

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

connectDatabase();

app.use('/users', users);


const Port = 8081;
app.listen(Port, ()=>{
    console.log(`Servidor rodando na url: http://localhost:${Port}`)
});

module.exports = app;