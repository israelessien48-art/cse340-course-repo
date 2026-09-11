import db from "./db.js";

export async function getAllOrganizations() {
  const { rows } = await db.query(`
    SELECT organization_id, name, description, contact_email, logo_filename
    FROM organization
    ORDER BY organization_id;
  `);

  return rows;
}

export async function getOrganizationDetails(id) {
  const organizationQuery = `
    SELECT
      organization_id,
      name,
      description,
      contact_email,
      logo_filename
    FROM organization
    WHERE organization_id = $1;
  `;

  const projectsQuery = `
    SELECT
      project_id,
      title,
      description,
      location,
      date
    FROM project
    WHERE organization_id = $1
    ORDER BY date, project_id;
  `;

  const organizationResult = await db.query(organizationQuery, [id]);

  if (organizationResult.rows.length === 0) {
    return null;
  }

  const projectsResult = await db.query(projectsQuery, [id]);

  return {
    ...organizationResult.rows[0],
    projects: projectsResult.rows
  };
}