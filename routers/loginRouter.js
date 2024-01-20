const express = require('express');
const router = express.Router();
const login = require('../controllers/loginController.js');

router.get('/userValidate/:userName/:userPassword', async (req,res) => {
    login.getUser(req,res);
});

module.exports = router;