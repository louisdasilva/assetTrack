// express setup
const express = require('express');
const app = express();
const port = process.env.port || 3000;
require('./dbConnection');

// ROUTERS
const loginRouter = require('./routers/loginRouter');
const partRouter = require('./routers/partsRouter');

// MIDDLEWARE
app.use(express.static(__dirname + '/'));
app.use(express.json());

//USE ROUTERS
app.use('/', loginRouter);
app.use('/api', partRouter);

// server listening
app.listen(port, () => {
    console.log(`express server listening on ${port}`);
});