let client = require('../dbConnection');
let collection = client.db().collection('Users');


async function getUser(userName, userPassword) {
    try {
        const userData = await collection.findOne(
            {username:userName,password:userPassword},
            {projection: {username:1} } // https://www.mongodb.com/docs/manual/tutorial/project-fields-from-query-results/
        );
        return userData;
    } catch (error) {
        console.error(">> Error in user.js getUser()", error);
        throw error;
    }
}

module.exports = { getUser };