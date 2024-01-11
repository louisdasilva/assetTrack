let user = require('../models/user.js');

const getUser = async (req,res)  => {

    const userName = req.params.userName;

    await user.getUser(userName)
        .then(result => {
            return res.json({ statusCode: 200, data: result, message: 'User data retrieved' });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
        });
};

module.exports = {getUser};