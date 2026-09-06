import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { getAllProjects } from "./src/models/projects.js";

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
app.get("/projects", async (req, res) => {
  try {
    const projects = await getAllProjects();
    console.log("Projects retrieved:", projects.length);
    res.render("projects", { title: "Service Projects", projects });
  } catch (error) {
    console.error("Error retrieving projects:", error);
    res.status(500).send("Unable to retrieve projects.");
  }
});

// Categories route
app.get("/categories", (req, res) => {
  res.render("categories", { title: "Categories" });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});






