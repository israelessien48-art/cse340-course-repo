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
  processUpdateProjectCategoriesForm,
  processAddVolunteer,
  processRemoveVolunteer
} from "./controllers/projects.js";

import {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm
} from "./controllers/categories.js";

import {
  showRegisterForm,
  processRegister,
  showLoginForm,
  processLogin,
  processLogout
} from "./controllers/auth.js";

import { organizationValidation } from "./validators/organizations.js";
import { projectValidation } from "./validators/projects.js";
import { categoryValidation } from "./validators/categories.js";

import { requireLogin, requireRole } from "./middleware/auth.js";

import { showUsersPage } from "./controllers/users.js";
import { showDashboard } from "./controllers/dashboard.js";

import { show404 } from "./controllers/errors.js";

const router = express.Router();

router.get("/register", showRegisterForm);
router.post("/register", processRegister);

router.get("/login", showLoginForm);
router.post("/login", processLogin);

router.post("/logout", processLogout);

router.get("/", buildHome);

router.get(
  "/dashboard",
  requireLogin,
  showDashboard
);

router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);

router.get(
  "/new-organization",
  requireRole(2),
  showNewOrganizationForm
);

router.post(
  "/new-organization",
  requireRole(2),
  organizationValidation,
  processNewOrganizationForm
);

router.get(
  "/edit-organization/:id",
  requireRole(2),
  showEditOrganizationForm
);

router.post(
  "/edit-organization/:id",
  requireRole(2),
  organizationValidation,
  processEditOrganizationForm
);

router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);

router.get(
  "/project/:id/volunteer",
  requireLogin,
  processAddVolunteer
);

router.get(
  "/project/:id/unvolunteer",
  requireLogin,
  processRemoveVolunteer
);

router.get(
  "/new-project",
  requireRole(2),
  showNewProjectForm
);

router.post(
  "/new-project",
  requireRole(2),
  projectValidation,
  processNewProjectForm
);

router.get(
  "/edit-project/:id",
  requireRole(2),
  showEditProjectForm
);

router.post(
  "/edit-project/:id",
  requireRole(2),
  projectValidation,
  processEditProjectForm
);

router.get(
  "/project/:id/categories",
  requireRole(2),
  showUpdateProjectCategoriesForm
);

router.post(
  "/project/:id/categories",
  requireRole(2),
  processUpdateProjectCategoriesForm
);

router.get("/categories", showCategoriesPage);
router.get("/category/:id", showCategoryDetailsPage);

router.get(
  "/new-category",
  requireRole(2),
  showNewCategoryForm
);

router.post(
  "/new-category",
  requireRole(2),
  categoryValidation,
  processNewCategoryForm
);

router.get(
  "/edit-category/:id",
  requireRole(2),
  showEditCategoryForm
);

router.post(
  "/edit-category/:id",
  requireRole(2),
  categoryValidation,
  processEditCategoryForm
);

// Admin-only users page
router.get(
  "/users",
  requireRole(2),
  showUsersPage
);

router.use(show404);

export default router;