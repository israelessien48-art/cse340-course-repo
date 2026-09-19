import db from "./db.js";

export const getAllProjects = async () => {
  const { rows } = await db.query(`
    SELECT
      p.project_id,
      p.organization_id,
      p.title,
      p.description,
      p.location,
      p.date,
      TO_CHAR(p.date, 'FMMonth FMDD, YYYY') AS formatted_date,
      o.name AS organization_name
    FROM project AS p
    JOIN organization AS o
      ON p.organization_id = o.organization_id
    ORDER BY p.date, p.project_id;
  `);

  return rows;
};

export const getUpcomingProjects = async (number_of_projects) => {
  const { rows } = await db.query(
    `
      SELECT
        p.project_id,
        p.organization_id,
        p.title,
        p.description,
        p.location,
        p.date,
        TO_CHAR(p.date, 'FMMonth FMDD, YYYY') AS formatted_date,
        o.name AS organization_name
      FROM project AS p
      JOIN organization AS o
        ON p.organization_id = o.organization_id
      WHERE p.date >= CURRENT_DATE
      ORDER BY p.date, p.project_id
      LIMIT $1;
    `,
    [number_of_projects]
  );

  return rows;
};

export const getProjectDetails = async (id) => {
  const { rows } = await db.query(
    `
      SELECT
        p.project_id,
        p.organization_id,
        p.title,
        p.description,
        p.location,
        TO_CHAR(p.date, 'YYYY-MM-DD') AS date,
        TO_CHAR(p.date, 'FMMonth FMDD, YYYY') AS formatted_date,
        o.name AS organization_name
      FROM project AS p
      JOIN organization AS o
        ON p.organization_id = o.organization_id
      WHERE p.project_id = $1;
    `,
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
};

export const getCategoriesByProjectId = async (id) => {
  const { rows } = await db.query(
    `
      SELECT
        c.category_id,
        c.name
      FROM category AS c
      JOIN project_category AS pc
        ON c.category_id = pc.category_id
      WHERE pc.project_id = $1
      ORDER BY c.category_id;
    `,
    [id]
  );

  return rows;
};

export const createProject = async (
  organization_id,
  title,
  description,
  location,
  date
) => {
  const result = await db.query(
    `
      INSERT INTO project
        (organization_id, title, description, location, date)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `,
    [
      organization_id,
      title,
      description,
      location,
      date
    ]
  );

  return result.rows[0];
};

export const updateProject = async (
  project_id,
  organization_id,
  title,
  description,
  location,
  date
) => {
  const result = await db.query(
    `
      UPDATE project
      SET
        organization_id = $1,
        title = $2,
        description = $3,
        location = $4,
        date = $5
      WHERE project_id = $6
      RETURNING project_id;
    `,
    [
      organization_id,
      title,
      description,
      location,
      date,
      project_id
    ]
  );

  if (result.rows.length === 0) {
    throw new Error("Project update failed.");
  }

  return result.rows[0];
};

export const updateProjectCategories = async (
  projectId,
  categoryIds
) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
        DELETE FROM project_category
        WHERE project_id = $1;
      `,
      [projectId]
    );

    for (const categoryId of categoryIds) {
      await client.query(
        `
          INSERT INTO project_category
            (project_id, category_id)
          VALUES
            ($1, $2);
        `,
        [projectId, categoryId]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};