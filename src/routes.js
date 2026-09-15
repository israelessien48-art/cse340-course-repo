import express from "express";

import { buildHome } from "./controllers/index.js";

import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm
} from "./controllers/organizations.js";

import {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  showUpdateProjectCategoriesForm,
  processUpdateProjectCategoriesForm
} from "./controllers/projects.js";

import {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm
} from "./controllers/categories.js";

import { organizationValidation } from "./validators/organizations.js";

import { projectValidation } from "./validators/projects.js";

import { categoryValidation } from "./validators/categories.js";

import { show404 } from "./controllers/errors.js";

const router = express.Router();

router.get("/", buildHome);

router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);

router.get("/new-organization", showNewOrganizationForm);
router.post(
  "/new-organization",
  organizationValidation,
  processNewOrganizationForm
);

router.get("/edit-organization/:id", showEditOrganizationForm);
router.post(
  "/edit-organization/:id",
  organizationValidation,
  processEditOrganizationForm
);

router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);

router.get("/new-project", showNewProjectForm);
router.post(
  "/new-project",
  projectValidation,
  processNewProjectForm
);

router.get("/edit-project/:id", showEditProjectForm);
router.post(
  "/edit-project/:id",
  projectValidation,
  processEditProjectForm
);

router.get(
  "/project/:id/categories",
  showUpdateProjectCategoriesForm
);

router.post(
  "/project/:id/categories",
  processUpdateProjectCategoriesForm
);

router.get("/categories", showCategoriesPage);
router.get("/category/:id", showCategoryDetailsPage);

router.get("/new-category", showNewCategoryForm);
router.post(
  "/new-category",
  categoryValidation,
  processNewCategoryForm
);

router.get("/edit-category/:id", showEditCategoryForm);
router.post(
  "/edit-category/:id",
  categoryValidation,
  processEditCategoryForm
);

router.use(show404);

export default router;