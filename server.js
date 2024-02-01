const port = process.env.PORT || 3000;
const SERVER_URL = `http://localhost:${port}`;
const DIR = __dirname;

// EXPRESS SETUP
const express = require('express');
const app = express(); //'app' refers to an instance of the Express application


const bodyParser = require("body-parser");
const path = require("path");

// DATABASE SETUP
require('./dbConnection');

// WEBSOCKETS SETUP
let http = require('http').createServer(app); //Import http module and execute the createServer method with a reference to the server via http
let io = require('socket.io')(http); // << LINK HTTP SERVER & SOCKET.IO LIBRARY >>

// ROUTERS
const loginRouter = require('./routers/loginRouter');
const partRouter = require('./routers/partsRouter');
const catalogueRoutes = require("./catalogue/Routes/routes");

// MIDDLEWARE
app.use(express.static(__dirname + '/'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "catalogue/views"));
app.use(express.static(path.join(__dirname, "catalogue/public")));

// MIDDLEWARE - ROUTERS
app.use('/login', loginRouter);
app.use('/authenticate', loginRouter);
app.use('/api', partRouter);

// MIDDLEWARE - AUTHENTICATION
const axios = require('axios');
async function authenticate(req, res, next) {
    session = req.query.sk;
    try {
        const authentication = await axios.get(`${SERVER_URL}/authenticate/${session}`);
        const authorised = authentication.data;
        if (authorised) {
            next();
            return
        }
        res.send("Session Expired! Please return to log in page and sign in.");
    } catch (error) {
        console.log("(!) 500: Server Authentication Error: ", error);
        throw error;
    };
}

// MIDDLEWARE - STATIC FILE SERVING
// app.get('/catalogue', (req,res) => {
//     res.sendFile(`${DIR}/catalogue.html`);
// })
app.use("/catalogue", catalogueRoutes);

app.get('/dash', authenticate, (req, res) => {
    res.sendFile(`${DIR}/dashboard.html`);
});
app.get('/home', (req, res) => {
    res.sendFile(`${DIR}/home.html`);
});
app.get('/inventory', authenticate, (req, res) => {
    res.sendFile(`${DIR}/inventory.html`);
});
app.get('/template', authenticate, (req, res) => {
    res.sendFile(`${DIR}/template.html`);
})
app.get('*', (req, res) => { // any navigation attempt to anything other than the above provided paths will return to index/login.
    res.sendFile(`${DIR}/index.html`);
});

// << SOCKETS >>
// Listen For Client Connection
io.on('connection', (socket) => // event listener triggered when a new connection is established with server
{
    console.log('Client ' + socket.id + ': connected to server');
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
        console.log('Client ' + socket.id + ': disconnected from server');
    });
});


// << END SOCKETS >>

// server listening
http.listen(port, () => {
    console.log(`express server listening on ${port}`);
});
