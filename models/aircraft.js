let client = require('../dbConnection');
let collection = client.db().collection('Aircraft');

async function addAircraft(rego) {
	try{
		const result = await collection.insertOne({registration:rego});
		if(result.acknowledged){ // mongoDB will return {acknowledged:true, ... } on successful insert
			return {statusCode:200, data:result};
		} else {
			return {statusCode:500};
		}
	} catch (error) {
		console.error("(!) Error in aircraft.js addAircraft(): ", error);
        return {statusCode:500};
	}
};

module.exports = { addAircraft };