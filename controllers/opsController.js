let aircraft = require('../models/aircraft.js');

const getFleet = async (req,res) => {
    await aircraft.getFleet()
        .then(result => {
            if(result.statusCode == 200){
                return res.status(200).json({ statusCode: 200, fleet:result.data });
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

const getAircraft = async (req,res) => {
    const rego = req.params.rego;
    await aircraft.getAircraft(rego)
        .then(result => {
            if(result.statusCode == 200){
                return res.status(200).json({ statusCode: 200, aircraft:result.data });
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

// TO DO *** PUT ALL OF THIS INTO ONE FUNCTION 
/*
        .then(result => {
            if(result.statusCode == 200){
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
*/

const addAircraft = async (req,res) => {
    const rego = req.body.rego;
    await aircraft.addAircraft(rego)
        .then(result => {
            if(result.statusCode == 200){
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

const installPart = async (req,res) => {
    const rego = req.body.rego;
    const part = req.body.verifiedPart;
    await aircraft.installPart(rego, part)
        .then(result => {
            if(result.statusCode == 200){
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

module.exports = { getFleet, getAircraft, addAircraft, installPart };