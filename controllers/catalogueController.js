
const mongoose = require('mongoose');
let collection = require('../models/part');

const addPart = async (req, res) => {
    try {
        const family = req.body.partFamily
        if (family == "" || family == null || family == undefined) {
            console.error("ERROR: Missing \"Part Family\" Input");
            res.status(400).json({ statusCode: 400, data: {}, message: 'empty input' });
        }
        else if (family.toLowerCase() !== "wing" && family.toLowerCase() !== "fuselage" && family.toLowerCase() !== "tail" && family.toLowerCase() !== "engine" && family.toLowerCase() !== "landing gear" && family.toLowerCase() !== "cockpit") {
            console.log("ERROR: Invalid \"Part Family\" Input ");
            res.status(400).json({ statusCode: 400, data: {}, message: 'invalidInput' });
        } else {
            collection.postPart(req.body, (err, result) => {
                if (err) {
                    res.status(500).json({ statusCode: 500, error: err, message: 'Internal Server Error' });
                }
                else {
                    console.log(req.rawHeaders)
                    const referrer = req.headers.referrer || req.get("Referrer");
                    const redirectTo = referrer ? referrer : "/catalogue"
                    res.redirect(redirectTo)
                }
            });
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'error adding part to the database' });
    };
};

const getAllParts = (req, res) => {
    collection.getAllParts((err, result) => {
        if (err) {
            console.error('ERROR: Get All Parts Failed: ', err);
            res.status(500).json({ statusCode: 500, error: err, message: 'Internal Server Error' });
        }
        else {
            res.render("partCatalogue.ejs", {
                parts: result
            });
        }
    });
}

const getPartById = (req, res) => {
    collection.getPartById(req.params.id, (err, result) => {
        if (err) {
            res.json("error")
        } else {
            res.render("description.ejs", {
                part: result
            });
        }
    })
}

const delPart = (req, res) => {
    collection.deletePart(req.params.id, (err, result) => {
        if (err) {
            console.error('ERROR: Delete Part Failed: ', err);
            res.status(500).json({ statusCode: 500, error: err, message: 'Internal Server Error' });
        } else {
            res.json({ success: true, message: 'part was successully deleted from database' });
        }
    });
}

module.exports = {
    addPart,
    delPart,
    getAllParts,
    getPartById
}
