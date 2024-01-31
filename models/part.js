// IMPORTS
const { ObjectId } = require('mongodb');
let client = require('../dbConnection'); // Import file dbConnection.js from parent directory (../)
let collection = client.db().collection('Parts'); // Retrieve collection "Parts" from current MongoDB database in dbconnection

// << METHOD: POST PART TO DATABASE >>
// -----------------------------------
async function postPart(part, callback) {
    try {
        console.log("Attempting To Add Part To -> \"parts\" collection...");
        // INSERT PART INTO COLLECTION
        const result = await collection.insertOne(part); // MongoDB performs insertion of part into collection
        // CALLBACK: OBJECT SUCCESSFULLY ADDED TO DB
        if (result.insertedId) {
            callback(null, { statusCode: 201, message: 'ID inserted' });
        }
        // CALLBACK: OBJECT FAILED TO BE ADDED TO DB
        else {
            console.log("ERROR: Add Part Failed - No ID Assigned");
            callback({ statusCode: 500, message: 'Add Part Failed' }, null);
        }
    // CATCH ERROR WHILE ADDING PART TO DB
    }   catch (error) {
            console.log('ERROR: Add Part Failed -  MongoDB Error');
            callback({ statusCode: 500, message: 'MongoDB Error', error: error.message }, null);
        }
}

// << METHOD: UPDATE PART IN DATABASE >>
// -------------------------------------
async function updatePart(partID, updatedPart, callback) {
    try {
        // UPDATE PART IN COLLECTION
        const result = await collection.updateOne(
            { _id: new ObjectId(partID) },
            { $set: updatedPart }
        );

        // CALLBACK: OBJECT SUCCESSFULLY UPDATED IN DB
        if (result.matchedCount > 0) {
            console.log('Part Updated Successfully');
            callback(null, { statusCode: 200, message: 'Part updated successfully' });
        } 
        // CALLBACK: ID NOT FOUND IN DB
        else {
            console.log('Part not found');
            callback({ statusCode: 404, message: 'Part not found' }, null);
        }
    } catch (error) {
        console.error('Error updating part:', error);
        callback({ statusCode: 500, message: 'Internal Server Error' }, null);
    }
}

// << METHOD: DELETE PART FROM DATABASE >>
// ---------------------------------------
async function deletePart(partID, callback) {
    try {
        // DELETE PART FROM COLLECTION
        const result = await collection.deleteOne({ _id: new ObjectId(partID) });
        // CALLBACK: OBJECT SUCCESSFULLY DELETED FROM DB
        if (result.deletedCount > 0) {
            console.log('Card Deleted Successfully');
            callback(null, { statusCode: 204, message: 'Card deleted successfully' });
        } 
        // CALLBACK: ID NOT FOUND IN DB
        else {
            console.log('Card not found');
            console.log(cardId);
            callback({ statusCode: 404, message: 'Card not found' }, null);
        }
    // CATCH ERROR WHILE DELETING PART FROM DB
    } catch (error) {
        console.error('Error deleting card:', error);
        callback({ statusCode: 500, message: 'Internal Server Error' }, null);
    }
}

// << METHOD: GET ALL PARTS FROM DATABASE >>
// -----------------------------------------
function getAllParts(callback) {
    //query empty objects {} (all objects), convert to array and execute callback of potential errors and results.
    collection.find({}).toArray() // Use the toArray method with a promise.
    .then(result => callback(null, result))
    .catch(error => callback(error, null));
}

//EXPORTS
module.exports = {postPart, getAllParts, deletePart, updatePart}