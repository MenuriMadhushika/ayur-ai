const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "AyurAI Backend is running successfully 🌿"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`AyurAI backend running at http://localhost:${PORT}`);
});