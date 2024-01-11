const express = require('express');
const router = express.Router();
const login = require('../controllers/loginController.js');

router.get('/', (req,res) => {
    res.sendFile('../index.html');
});

router.get('/userValidate/:userName', async (req,res) => {
    login.getUser(req,res);
});

module.exports = router;