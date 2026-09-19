import {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
  updateOrganization
} from "../models/organizations.js";

import { validationResult } from "express-validator";

export const showOrganizationsPage = async (req, res, next) => {
  try {
    const organizations = await getAllOrganizations();

    res.render("organizations", {
      title: "Organizations",
      organizations
    });
  } catch (error) {
    next(error);
  }
};

export const showOrganizationDetailsPage = async (req, res, next) => {
  try {
    const organizationId = req.params.id;
    const organization = await getOrganizationDetails(organizationId);

    if (!organization) {
      const err = new Error("Organization not found");
      err.status = 404;
      return next(err);
    }

    res.render("organization", {
      title: organization.name,
      organization
    });
  } catch (error) {
    next(error);
  }
};

export const showNewOrganizationForm = (req, res) => {
  res.render("new-organization", {
    title: "Add Organization",
    errors: [],
    data: {}
  });
};

export const processNewOrganizationForm = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("new-organization", {
      title: "Add Organization",
      errors: errors.array(),
      data: req.body
    });
  }

  try {
    const {
      name,
      description,
      contact_email,
      logo_filename
    } = req.body;

    await createOrganization(
      name,
      description,
      contact_email,
      logo_filename
    );

    req.flash("success", "Organization created successfully.");
    res.redirect("/organizations");
  } catch (error) {
    next(error);
  }
};

export const showEditOrganizationForm = async (req, res, next) => {
  try {
    const organizationId = req.params.id;
    const organization = await getOrganizationDetails(organizationId);

    if (!organization) {
      const err = new Error("Organization not found");
      err.status = 404;
      return next(err);
    }

    res.render("edit-organization", {
      title: `Edit ${organization.name}`,
      errors: [],
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

export const processEditOrganizationForm = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("edit-organization", {
      title: "Edit Organization",
      errors: errors.array(),
      data: {
        organization_id: req.params.id,
        ...req.body
      }
    });
  }

  try {
    const organizationId = req.params.id;

    const {
      name,
      description,
      contact_email,
      logo_filename
    } = req.body;

    await updateOrganization(
      organizationId,
      name,
      description,
      contact_email,
      logo_filename
    );

    req.flash("success", "Organization updated successfully.");
    res.redirect(`/organization/${organizationId}`);
  } catch (error) {
    next(error);
  }
};