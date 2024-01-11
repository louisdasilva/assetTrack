// IMPORTS
const { ObjectId } = require('mongodb'); // ACCESS MONGODB PROPERTY
let collection = require('../models/part');

// << METHOD: VALIDATE CLIENT INPUT -> CALL TO POST INPUT TO DATABASE -> SERVE RESULT TO CLIENT >>
// -----------------------------------------------------------------------------------------------
const postPart = (req,res) => {
    // << RETRIEVE CLIENT INPUT ABOUT PART >>
    let part = req.body;
    let partFamily = part.partFamily;
    console.log('Received POST Request - Data:', part);

    // << VALIDATE CLIENT INPUT >>
    // ---------------------------
    // CHECK INPUT EXISTS 
    if (part.partFamily == "" || part.partFamily == null || part.partFamily == undefined) {
        console.error("ERROR: Missing \"Part Family\" Input");
        res.status(400).json({ statusCode: 400, data: {}, message: 'empty input' });
    }
    // CHECK INPUT IS VALID 
    else if (partFamily.toLowerCase() !== "wing" && partFamily.toLowerCase() !== "fuselage" && partFamily.toLowerCase() !== "tail" && partFamily.toLowerCase() !== "engine" && partFamily.toLowerCase() !== "landing gear" && partFamily.toLowerCase() !== "cockpit") {
        console.log("ERROR: Invalid \"Part Family\" Input ");
        res.status(400).json({ statusCode: 400, data: {}, message: 'invalidInput' });
    }
    // << END VALIDATE CLIENT INPUT >>
    // ATTEMPT POST
    else 
    {
        collection.postPart(part, (err,result) => {
            // CHECK FOR POST ERROR
            if (err) {
                console.error('ERROR: Add Part Failed: ', err);
                res.status(500).json({ statusCode: 500, error: err, message: 'Internal Server Error' });
            }
            // SEND JSON RESPONSE TO CLIENT CONFIRMING SUCCESS
            else {
                console.log("Part Successfully Added");
                res.json({statusCode:201,data:result,message:'Success'});
            }
        });   
    }
}

// << METHOD: GET ALL PARTS FROM DATABASE >>
// -----------------------------------------
const getAllParts = (req,res) => {
    // ATEMPT GET
    collection.getAllParts((err,result) =>
    {
        // CHECK FOR GET ERROR
        if (err) {
            console.error('ERROR: Get All Parts Failed: ', err);
            res.status(500).json({ statusCode: 500, error: err, message: 'Internal Server Error' });
        }
        // SEND JSON RESPONSE TO CLIENT CONFIRMING SUCCESS
        else {
            res.json({statusCode:200,data:result,message:'success'});
        }
    });
}

// << METHOD: DELETE PART FROM DATABASE >>
// ---------------------------------------
const deletePart = (req,res) =>
{
    // ATEMPT DELETE
    collection.deletePart(req.params.id, (err,result) =>
    {
        // CHECK FOR DELETE ERROR
        if (err) {
            console.error('ERROR: Delete Part Failed: ', err);
            res.status(500).json({ statusCode: 500, error: err, message: 'Internal Server Error' });
        }
        else {
            // SEND JSON RESPONSE TO CLIENT CONFIRMING SUCCESS
            res.json({statusCode:204,data:result,message:'success'});
        }
    });
}

//EXPORTS
module.exports = {postPart, getAllParts, deletePart}