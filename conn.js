const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGODB_URI;

const dbName = "test";

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
    const db = client.db(dbName);
    console.log("DB Connected");
    return db;
  } catch (error) {
    await client.close();
    console.log("DB Disconnected!");
    throw error;
  }
}

module.exports = connectDB;
