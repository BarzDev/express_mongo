const express = require("express");
const app = express();

const connectDB = require("./utils/connection");

const postingRoutes = require("./routes/posting");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hi.. it'z my express mongodb API");
});
app.use("/posting", postingRoutes);

connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log("Server Started"));
});

module.exports = app;
