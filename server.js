const port = process.env.PORT || 3000;
const DIR = __dirname;

// EXPRESS SETUP
const express = require('express');
const app = express(); //'app' refers to an instance of the Express application

// DATABASE SETUP
require('./dbConnection');

// WEBSOCKETS SETUP
let http = require('http').createServer(app); //Import http module and execute the createServer method with a reference to the server via http
let io = require('socket.io')(http); // << LINK HTTP SERVER & SOCKET.IO LIBRARY >>

// ROUTERS
const loginRouter = require('./routers/loginRouter');
const partRouter = require('./routers/partsRouter');

// MIDDLEWARE
app.use(express.static(DIR + '/'));
app.use(express.json());

// MIDDLEWARE - ROUTERS
app.use('/login', loginRouter);
app.use('/api', partRouter);

// NAVIGATION - STATIC FILE SERVING
app.get('/home', (req,res) => {
    res.sendFile(`${DIR}/home.html`);
});
app.get('/parts', (req,res) => {
    res.sendFile(`${DIR}/parts.html`);
});

// << SOCKETS >>
// Listen For Client Connection
io.on( 'connection', (socket) => // event listener triggered when a new connection is established with server
{
    console.log('Client '+socket.id+ ': connected to server');
    // Listen for 'message' event from client
    socket.on('message', (msg) => {
        console.log(`Message from client ${socket.id}: ${msg}`);
        socket.emit('reply', 'Server Recieved Message.');
    });

    // Listen for 'addPart' event from client
    socket.on('addPart', (part) => {
        io.emit('partAdded', part);// Broadcast the added part to all clients
    });
    // Listen for 'removePart' event from client
    socket.on('removePart', (part) => {
        io.emit('partRemoved', part);// Broadcast part removed to all clients
    });

    // Listen For Client Disconnect
    socket.on('disconnect', () => // event listener triggered when disconneted with server
    {
        console.log('Client '+socket.id+ ': disconnected from server');
    });
});
// << END SOCKETS >>

// server listening
http.listen(port, () => {
    console.log(`express server listening on ${port}`);
});