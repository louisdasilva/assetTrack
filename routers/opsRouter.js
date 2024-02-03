const express = require('express');
const router = express.Router();
const ops = require('../controllers/opsController.js');

router.post('/addAircraft', async (req,res) => {
    ops.addAircraft(req,res);
});

module.exports = router;