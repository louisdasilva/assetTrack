let express = require('express');
let app = express();
let port = process.env.port || 3000;

app.get('/', function (req,res) {
    res.send('Hello World')
});

app.listen(port, () => {
    console.log('express server started');
});