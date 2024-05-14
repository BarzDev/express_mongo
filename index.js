const express = require("express");
const app = express();
const { ObjectId } = require("mongodb");
const connectDB = require("./conn");

app.use(express.json());

app.get("/posting", async (req, res) => {
  try {
    const db = await connectDB();
    const posting = await db.collection("postings").find().toArray();
    res.json(posting);
    console.log("GET POSTING ROUTE AT " + Date.now());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/posting/find/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const db = await connectDB();
    const data = await db
      .collection("postings")
      .findOne({ _id: new ObjectId(id) });

    if (!data) {
      return res.status(404).json({ message: "Posting not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/posting", async (req, res) => {
  try {
    const { username, content } = req.body;

    if (!username || !content) {
      return res
        .status(400)
        .json({ message: "Username and content are required" });
    }

    const invalidProps = Object.keys(req.body).filter(
      (prop) => prop !== "username" && prop !== "content"
    );
    if (invalidProps.length > 0) {
      return res
        .status(400)
        .json({ message: "Invalid properties: " + invalidProps.join(", ") });
    }

    const db = await connectDB();
    const data = {
      username,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.collection("postings").insertOne(data);
    res
      .status(201)
      .json({ message: "Posting created successfully", data: data });
    console.log("POST POSTING ROUTE AT " + Date.now());
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/posting/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { username, content } = req.body;

    const db = await connectDB();

    const result = await db
      .collection("postings")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { username, content, updatedAt: new Date() } },
        { returnOriginal: false }
      );

    if (!result) {
      return res.status(404).json({ message: "Posting not found" });
    }

    res.json({ message: "Posting updated successfully", data: req.body });
    console.log("PUT POSTING ROUTE AT " + Date.now());
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/posting/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const db = await connectDB();
    const result = await db
      .collection("postings")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Posting not found" });
    }

    res.json({ message: "Posting deleted successfully" });
    console.log("DELETE POSTING ROUTE AT " + Date.now());
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log("Server Started"));
});

module.exports = app;
