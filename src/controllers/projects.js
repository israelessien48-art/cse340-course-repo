import {
  getUpcomingProjects,
  getProjectDetails,
  getCategoriesByProjectId,
  createProject,
  updateProject,
  updateProjectCategories
} from "../models/projects.js";

import { getAllOrganizations } from "../models/organizations.js";

import {
  addVolunteer,
  removeVolunteer,
  isUserVolunteer
} from "../models/volunteers.js";

import { validationResult } from "express-validator";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

export const showProjectsPage = async (req, res, next) => {
  try {
    const projects = await getUpcomingProjects(
      NUMBER_OF_UPCOMING_PROJECTS
    );

    res.render("projects", {
      title: "Upcoming Service Projects",
      projects
    });
  } catch (error) {
    next(error);
  }
};

export const showProjectDetailsPage = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);

    if (!project) {
      const err = new Error("Project not found");
      err.status = 404;
      return next(err);
    }

    const categories = await getCategoriesByProjectId(projectId);

    let isVolunteer = false;

    if (req.session.user) {
      isVolunteer = await isUserVolunteer(
        req.session.user.user_id,
        projectId
      );
    }

    res.render("project", {
      title: project.title,
      project: {
        ...project,
        categories
      },
      isVolunteer
    });
  } catch (error) {
    next(error);
  }
};

export const processAddVolunteer = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    const project = await getProjectDetails(projectId);

    if (!project) {
      const err = new Error("Project not found");
      err.status = 404;
      return next(err);
    }

    await addVolunteer(userId, projectId);

    req.flash(
      "success",
      `You are now volunteering for ${project.title}.`
    );

    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};

export const processRemoveVolunteer = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    const project = await getProjectDetails(projectId);

    if (!project) {
      const err = new Error("Project not found");
      err.status = 404;
      return next(err);
    }

    await removeVolunteer(userId, projectId);

    req.flash(
      "success",
      `You are no longer volunteering for ${project.title}.`
    );

    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};

export const showNewProjectForm = async (req, res, next) => {
  try {
    const organizations = await getAllOrganizations();

    res.render("new-project", {
      title: "Add Project",
      errors: [],
      data: {},
      organizations
    });
  } catch (error) {
    next(error);
  }
};

export const processNewProjectForm = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    try {
      const organizations = await getAllOrganizations();

      return res.status(400).render("new-project", {
        title: "Add Project",
        errors: errors.array(),
        data: req.body,
        organizations
      });
    } catch (error) {
      return next(error);
    }
  }

  try {
    const {
      organization_id,
      title,
      description,
      location,
      date
    } = req.body;

    const project = await createProject(
      organization_id,
      title,
      description,
      location,
      date
    );

    req.flash("success", "Project created successfully.");

    res.redirect(`/project/${project.project_id}`);
  } catch (error) {
    next(error);
  }
};

export const showEditProjectForm = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);

    if (!project) {
      const err = new Error("Project not found");
      err.status = 404;
      return next(err);
    }

    const organizations = await getAllOrganizations();

    res.render("edit-project", {
      title: `Edit ${project.title}`,
      errors: [],
      data: project,
      organizations
    });
  } catch (error) {
    next(error);
  }
};

export const processEditProjectForm = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    try {
      const organizations = await getAllOrganizations();

      return res.status(400).render("edit-project", {
        title: "Edit Project",
        errors: errors.array(),
        data: {
          project_id: req.params.id,
          ...req.body
        },
        organizations
      });
    } catch (error) {
      return next(error);
    }
  }

  try {
    const projectId = req.params.id;

    const {
      organization_id,
      title,
      description,
      location,
      date
    } = req.body;

    await updateProject(
      projectId,
      organization_id,
      title,
      description,
      location,
      date
    );

    req.flash("success", "Project updated successfully.");

    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};

export const showUpdateProjectCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);

    if (!project) {
      const err = new Error("Project not found");
      err.status = 404;
      return next(err);
    }

    const { getAllCategories } = await import("../models/categories.js");

    const categories = await getAllCategories();
    const currentCategories = await getCategoriesByProjectId(projectId);

    const currentCategoryIds = currentCategories.map(
      (category) => category.category_id
    );

    res.render("project-categories", {
      title: `Update Categories for ${project.title}`,
      project,
      categories,
      currentCategoryIds,
      errors: []
    });
  } catch (error) {
    next(error);
  }
};

export const processUpdateProjectCategoriesForm = async (
  req,
  res,
  next
) => {
  try {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);

    if (!project) {
      const err = new Error("Project not found");
      err.status = 404;
      return next(err);
    }

    let categoryIds = req.body?.category_ids || [];

    if (!Array.isArray(categoryIds)) {
      categoryIds = [categoryIds];
    }

    await updateProjectCategories(projectId, categoryIds);

    req.flash(
      "success",
      "Project categories updated successfully."
    );

    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};