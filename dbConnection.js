// refer documentation @:
// https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connect/#std-label-node-connect-to-mongodb

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb+srv://admin:admin2@cluster0.l9hmwv8.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	}
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
        await client.close();
        console.log(error);
  }
}
run().catch(console.dir);

module.exports = client;