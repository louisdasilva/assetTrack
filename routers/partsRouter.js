//Import the express module - a framework for buidling web applications in Node.js
let express = require('express');
//Create an instance of the express router - a modular, mini-application that can handle routes 
let router = express.Router();
//Import file partsController.js from controllers folder in parent directory (../)
let controller = require('../controllers/partsController');

// << DEFINE ROUTE HANDLERS >>
router.post('/part', (req,res) => { controller.postPart(req,res); });
router.get('/parts', (req,res) => { controller.getAllParts(req,res); });
router.delete('/part/:id', (req,res) => { controller.deletePart(req,res); });

// << EXPORT ROUTER INSTANCE >>
module.exports = router; //When this file is required, the router instance will be made available