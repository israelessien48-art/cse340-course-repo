import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Home route
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// Organizations route
app.get("/organizations", (req, res) => {
  res.render("organizations", { title: "Organizations" });
});

// Service Projects route
app.get("/projects", (req, res) => {
  res.render("projects", { title: "Service Projects" });
});

// Categories route
app.get("/categories", (req, res) => {
  res.render("categories", { title: "Categories" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});