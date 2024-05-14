const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const connectDB = require("../utils/connection");
const logger = require("../utils/logger");
require("dotenv").config();
const collection = process.env.DB_COLLECTION;

router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const posting = await db.collection(collection).find().toArray();
    res.json(posting);
    logger("GET", "posting");
  } catch (err) {
    res.status(500).json({ message: err.message });
    logger("GET", "posting", err);
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const db = await connectDB();
    const data = await db
      .collection(collection)
      .findOne({ _id: new ObjectId(id) });

    if (!data) {
      return res.status(404).json({ message: "Posting not found" });
    }

    res.json(data);
    logger("GET", "posting/find");
  } catch (err) {
    res.status(400).json({ message: err.message });
    logger("GET", "posting/find", err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, content } = req.body;

    const db = await connectDB();
    const data = {
      username,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.collection(collection).insertOne(data);
    res
      .status(201)
      .json({ message: "Posting created successfully", data: data });
    logger("POST", "posting");
  } catch (err) {
    res.status(400).json({ message: err.message });
    logger("POST", "posting", err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { username, content } = req.body;

    const db = await connectDB();
    const result = await db
      .collection(collection)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { username, content, updatedAt: new Date() } },
        { returnOriginal: false }
      );

    if (!result) {
      return res.status(404).json({ message: "Posting not found" });
    }

    res.json({ message: "Posting updated successfully", data: req.body });
    logger("PUT", "posting");
  } catch (err) {
    res.status(400).json({ message: err.message });
    logger("PUT", "posting", err);
  }
});

router.delete("/posting/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const db = await connectDB();
    const result = await db
      .collection(collection)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Posting not found" });
    }

    res.json({ message: "Posting deleted successfully" });
    logger("DELETE", "posting");
  } catch (err) {
    res.status(400).json({ message: err.message });
    logger("DELETE", "posting", err);
  }
});

module.exports = router;
