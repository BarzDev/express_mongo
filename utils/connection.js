const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    console.log("DB Connected");
    return client.db(dbName);
  } catch (error) {
    await client.close();
    console.log("DB Disconnected!");
    throw error;
  }
}

module.exports = connectDB;
