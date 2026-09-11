import express from "express";

import { buildHome } from "./controllers/index.js";

import {
  showOrganizationsPage,
  showOrganizationDetailsPage
} from "./controllers/organizations.js";

import {
  showProjectsPage,
  showProjectDetailsPage
} from "./controllers/projects.js";

import {
  showCategoriesPage,
  showCategoryDetailsPage
} from "./controllers/categories.js";

import { show404 } from "./controllers/errors.js";

const router = express.Router();

router.get("/", buildHome);

router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);

router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);

router.get("/categories", showCategoriesPage);
router.get("/category/:id", showCategoryDetailsPage);


router.use(show404);
export default router;