// express setup
const express = require('express');
const app = express();
const port = process.env.port || 3000;
require('./dbConnection');

// router
const router = require('./routers/router')

// middleware
app.use(express.static(__dirname + '/'));
app.use(express.json());
app.use('/', router);

// server listening
app.listen(port, () => {
    console.log(`express server listening on ${port}`);
});