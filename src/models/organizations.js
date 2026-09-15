import db from "./db.js";

export async function getAllOrganizations() {
  const { rows } = await db.query(`
    SELECT
      organization_id,
      name,
      description,
      contact_email,
      logo_filename
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

export async function createOrganization(
  name,
  description,
  contact_email,
  logo_filename
) {
  const result = await db.query(
    `
      INSERT INTO organization
        (name, description, contact_email, logo_filename)
      VALUES
        ($1, $2, $3, $4)
      RETURNING organization_id;
    `,
    [name, description, contact_email, logo_filename]
  );

  return result.rows[0];
}

export async function updateOrganization(
  organization_id,
  name,
  description,
  contact_email,
  logo_filename
) {
  const result = await db.query(
    `
      UPDATE organization
      SET
        name = $1,
        description = $2,
        contact_email = $3,
        logo_filename = $4
      WHERE organization_id = $5
      RETURNING organization_id;
    `,
    [
      name,
      description,
      contact_email,
      logo_filename,
      organization_id
    ]
  );

  if (result.rows.length === 0) {
    throw new Error("Organization update failed.");
  }

  return result.rows[0];
}