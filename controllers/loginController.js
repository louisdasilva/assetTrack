let user = require('../models/user.js');

const loginUser = async (req,res) => {
    const userName = req.params.userName;
    const userPassword = req.params.userPassword;
    await user.loginUser(userName, userPassword)
        .then(result => {
            if(result.statusCode == 401){
                return res.status(200).json({statusCode: 401, message: 'Authorisation failed - contact admin' });
            }
            if(result.statusCode == 200){
                return res.status(200).json({ statusCode: 200, session:result.session });
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

const authenticateSession = async (req,res) => {
    sessionKey = req.params.session;
    await user.authenticateSession(sessionKey)
        .then(result => {
            return res.send(result);
        });
};

module.exports = {loginUser, authenticateSession};