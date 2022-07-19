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


const clientPort = process.env.CLIENT_PORT || 3000


const corsOptions = {
    origin: `http://localhost:${clientPort}`,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions));

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', `http://localhost:${clientPort}`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');   
    res.setHeader('Access-Control-Allow-Credentials', true);    
    next();
});

connectDatabase();


let clients = [];

io.on('connection', (socket) => {
    clients.push(socket.id)

    socket.on('joinroom', (room) => {
        socket.join(room)
     })
    
    socket.on('message', ({ room, username, message, time })=>{   
        io.to(room).emit('message', { username, message, time })
        io.emit('NewMessage', { room, username, message, time })
    })

    socket.on('typing', (username, room)=>{
        socket.broadcast.emit("typing", username, room)
    })

    socket.on('disconnect', ()=>{
        clients.splice(clients.indexOf(socket), 1)
    });
});


app.use('/users', users);
app.use('/rooms', rooms);
app.use('/chat', chat);

const port = process.env.PORT || 8081;

server.listen(port, ()=>{
    console.info(`Server running on port ${port}`)
});

module.exports = app;