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
 *
 * documentation regarding HTTP status codes @
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses
 */
async function loginUser(userName, userPassword) {
    try {
        const userData = await collection.findOne(
            {username:userName,password:userPassword},
            {projection: {_id:0, username:1} } 
        );
        if(userData){
            const userSession = Math.random().toString();
            const sessionExpiry = setSessionExpiry();
            try {
                // documentation regarding updates and $set: @
                // https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/#compatibility
                const update = await collection.findOneAndUpdate(
                    {username:userName,password:userPassword},
                    {$set: {session:userSession, expiry:sessionExpiry} },
                    { 
                        returnDocument:"after",
                        projection: {_id:0, session:1} 
                    }
                );
            } catch (error) {
                console.error("(!) Error in user.js loginUser() session expiry update: ", error);
                return {statusCode:500};
            };
            return {statusCode:200, session:userSession};
        }
        return {statusCode:401};
    } catch (error) {
        console.error("(!) Error in user.js loginUser(): ", error);
        return {statusCode:500};
    };
};

/*
 * get the current UTC date and time
 * returns JSON object with keys: YEAR,MONTH,DAY,HOUR,MINUTE
 * https://bobbyhadz.com/blog/javascript-get-current-date-and-time-in-utc
 */
function getDate(){
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    return { YEAR:year, MONTH:month, DAY:day, HOUR:hour, MINUTE:minute };
}

/* 
 * setSessionExpiry will get the current date/time and return an expiry from it.
 * The expiry will be the current time + 1 hour, or the next day,
 * whichever occurs first. The hour is not carried into the next day.
 * Instead of delving into the complexity of different numbers of days
 * in various months, not to mention leap years, the code will simply
 * round between 11pm and midnight down to 11pm.
 * This means that a login between 11pm and 12pm will
 * expire at 12pm even if the login occurs at 11:59pm
 */ 
function setSessionExpiry() {
    let date = getDate();
    if(date.HOUR >= 23){
        date.HOUR = 23;
        date.MINUTE = 0;
    }
    date.HOUR += 1;
    sessionExpiry = { year:date.YEAR, month:date.MONTH, day:date.DAY, hour:date.HOUR, minute:date.MINUTE };
    return sessionExpiry;
};

/*
 * authenticateSession() searches the db for the given sessionKey
 * if the key is found then the expiry is retrieved and compared to the current date/time
 * 
 */
async function authenticateSession(sessionKey){
    try {
        const sessionExpiry = await collection.findOne(
        {session:sessionKey},
        {projection: {_id:0, expiry:1} } 
        );
        exp = sessionExpiry.expiry;
        let date = getDate();
        if(exp.year < date.YEAR){
            return false;
        }
        if(exp.month < date.MONTH){
            return false;
        }
        if(exp.day < date.DAY){
            return false;
        }
        if(exp.hour <= date.HOUR){
            return false;
        }
        return true;
    } catch (error) {
        console.error("(!) Error in user.js authenticateSession(): ", error);
        return false;
    };
};

module.exports = { loginUser, authenticateSession };