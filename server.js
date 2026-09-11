import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import router from "./src/routes.js";
import { show500 } from "./src/controllers/errors.js";

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

// Middleware to log all incoming requests
app.use((req, res, next) => {
  if (NODE_ENV === "development") {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV;
  next();
});

// Use application routes
app.use(router);

// Global error handler
app.use(show500);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});