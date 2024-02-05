const express = require('express');
const router = express.Router();
const ops = require('../controllers/opsController.js');

router.get('/fleet', async (req,res) => {
    ops.getFleet(req,res);
});

router.get('/getAircraft/:rego', async (req,res) => {
    ops.getAircraft(req,res);
});

router.post('/addAircraft', async (req,res) => {
    ops.addAircraft(req,res);
});

router.post('/installPart', async (req,res) => {
    ops.installPart(req,res);
});

module.exports = router;