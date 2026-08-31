import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("CSE 340 Web Backend Development is working!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});