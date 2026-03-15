const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// serve frontend
app.use(express.static(path.join(__dirname, "artifacts/rumaan-store")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "artifacts/rumaan-store/index.html"));
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
