// express setup
const express = require('express');
const app = express();
const port = process.env.port || 3000;

// middleware
app.use(express.static(__dirname + '/'));
app.use(express.json());

// routing
app.get('/', function (req,res) {
    res.sendFile('./index.html');
});

// server listening
app.listen(port, () => {
    console.log(`express server listening on ${port}`);
});