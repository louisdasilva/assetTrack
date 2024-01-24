const express = require('express');
const router = express.Router();
const login = require('../controllers/loginController.js');

router.get('/userValidate/:userName/:userPassword', async (req,res) => {
    login.loginUser(req,res);
});

router.get('/:session', async (req,res) => {
    login.authenticateSession(req,res);
});

module.exports = router;