let client = require('../dbConnection');

let collection = client.db().collection('Users');

async function getUser(userName) {

    try {
        const userData = await collection.find({username:userName}).toArray();
        return userData[0];
    } catch (error) {
        console.error(">> Error in user.js getUser()", error);
        throw error;
    }
}

module.exports = { getUser };