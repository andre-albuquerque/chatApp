const dotenv  = require('dotenv');
dotenv.config({ path: ".env" });

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: {origin: '*'}});

const bodyParser = require('body-parser');

const chat = require('./routes/Chat');
const users = require('./routes/Users');
const rooms = require('./routes/Rooms');


const connectDatabase = require('./config/Database');
const cors = require('cors');


app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

const corsOptions = {
    origin: 'http://localhost:3000',
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions));

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');   
    res.setHeader('Access-Control-Allow-Credentials', true);    
    next();
});

connectDatabase();


const clients = [];

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)
    clients.push(socket.id)

    socket.on('joinroom', room => {
        socket.join(room)
     })
    
    socket.on('message', ({ room, username, message })=>{   
        io.to(room).emit('message', { username, message })
        console.log(username, message, room)   
    })

    socket.on('typing', (username)=>{
        console.log(username)
        socket.broadcast.emit("typing", username)
    })

    socket.on('disconnect', ()=>{
        clients.splice(clients.indexOf(socket), 1)
        console.log(`Client disconnected ${socket.id}`)
    });
});

app.use('/users', users);
app.use('/rooms', rooms);
app.use('/chat', chat);

const Port = 8081;

server.listen(Port, ()=>{
    console.log(`Servidor rodando na url: http://localhost:${Port}`)
});

module.exports = app;