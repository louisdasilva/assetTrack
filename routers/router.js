const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.js');

router.get('/', (req,res) => {
    res.sendFile('../index.html');
});

router.get('/userValidate/:userName', async (req,res) => {
    controller.getUser(req,res);
});

module.exports = router;