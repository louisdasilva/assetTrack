const mongoose = require('mongoose');
const {
    partSchema
} = require('../models/part.model');
const partModel = mongoose.model('part', partSchema);
require('../dbconfig/db');

const partForm = async (req, res) => {
    const parts = await partModel.find();
    res.render("partCatalogue.ejs", {
        parts: parts
    });
}

const addPart = async (req, res) => {
    try {
        req.body.image = `uploads/${req.file.filename}`;
        const part = new partModel(req.body);
        await part.save();
        res.redirect("/catalogue")
    } catch (error) {
        res.json({ success: false, message: 'error adding part to the database' });
    };
};

const parts = async (req, res) => {
    try {
        const part = await partModel.find();
        res.json({ success: true, message: 'all parts succesfully retrieved', parts: part });
    } catch (error) {
        res.json({ success: false, message: 'Internal error occured' });
    };
};

const part = async (req, res) => {
    try {
        const part = await partModel.findById(req.params.id)
        res.render("description.ejs", {
            part: part
        });
    } catch (error) {
        res.json({ success: false, message: 'Internal error occured' });
    };
};

const delPart = async (req, res) => {
    try {
        await partModel.findByIdAndDelete(req.params.id)
        res.json({ success: true, message: 'part was successully deleted from database' });
    } catch (error) {
        res.json({ success: false, message: 'Internal error occured' });
    };
}

module.exports = {
    partForm,
    addPart,
    parts,
    part,
    delPart
}
