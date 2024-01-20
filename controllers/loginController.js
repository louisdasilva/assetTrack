let user = require('../models/user.js');

const getUser = async (req,res)  => {

    const userName = req.params.userName;
    const userPassword = req.params.userPassword;

    await user.getUser(userName, userPassword)
        .then(result => {
            console.log(result);
            if(result == undefined){
                return res.status(200).json({statusCode: 401, message: 'authorisation failed' });
            }
            if(result.username == userName){
                return res.status(200).json({ statusCode: 200 });
            }
            else{
                return res.status(500).json({statusCode: 500, message: 'Internal Server Failure' });
            }
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ statusCode: 500, message: error });
        });
};

module.exports = {getUser};