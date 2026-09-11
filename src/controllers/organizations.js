import {
  getAllOrganizations,
  getOrganizationDetails
} from "../models/organizations.js";

export async function showOrganizationsPage(req, res, next) {
  try {
    const organizations = await getAllOrganizations();

    res.render("organizations", {
      title: "Organizations",
      organizations
    });
  } catch (error) {
    next(error);
  }
}

export async function showOrganizationDetailsPage(req, res, next) {
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
}