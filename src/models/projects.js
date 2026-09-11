import db from "./db.js";

export async function getAllProjects() {
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
}

export async function getUpcomingProjects(number_of_projects) {
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
}

export async function getProjectDetails(id) {
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
      WHERE p.project_id = $1;
    `,
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}

export async function getCategoriesByProjectId(id) {
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
}