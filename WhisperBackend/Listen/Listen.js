const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {cors: {origin: "*", methods: ["GET", "POST"]}});

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.removeHeader('Permissions-Policy');
    next();
});

io.on('connection', socket => {
    socket.on('user-connected', user => {
        socket.user = user; 
        socket.emit('recieve-user-connected', user)
    });
    socket.on('user-connected', user => {socket.broadcast.emit('recieve-user-connected', user)});
    socket.on('send-chat-message', messageObj => {socket.broadcast.emit('recieve-chat-message', messageObj);})
    socket.on('disconnect', () => {if (socket.user) {socket.broadcast.emit('recieve-user-disconnected', socket.user)}});
});

server.listen(3000, () => {console.log('Server is running on http://localhost:3000');});

