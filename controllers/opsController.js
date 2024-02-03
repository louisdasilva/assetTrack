let aircraft = require('../models/aircraft.js');

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

module.exports = { addAircraft };