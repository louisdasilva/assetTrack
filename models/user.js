let client = require('../dbConnection');
let collection = client.db().collection('Users');

/*
 * Search user collection for one document with matching username and password.
 * Uses projection to only return username if a document is found.
 * If no matching document is found the return will be null.
 * 
 * documentation regarding searches @
 * https://www.mongodb.com/docs/manual/tutorial/query-documents/
 * 
 * documentation regarding projection @
 * https://www.mongodb.com/docs/manual/tutorial/project-fields-from-query-results/
 */
async function getUser(userName, userPassword) {
    try {
        const userData = await collection.findOne(
            {username:userName,password:userPassword},
            {projection: {username:1} } 
        );
        return userData;
    } catch (error) {
        console.error(">> Error in user.js getUser()", error);
        throw error;
    }
}

module.exports = { getUser };