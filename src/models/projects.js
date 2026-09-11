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

export async function getUpcomingProjects(numberOfProjects) {
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
    [numberOfProjects]
  );

  return rows;
}

export async function getProjectDetails(id) {
  const projectQuery = `
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
  `;

  const categoriesQuery = `
    SELECT
      c.category_id,
      c.name
    FROM category AS c
    JOIN project_category AS pc
      ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.category_id;
  `;

  const projectResult = await db.query(projectQuery, [id]);

  if (projectResult.rows.length === 0) {
    return null;
  }

  const categoriesResult = await db.query(categoriesQuery, [id]);

  return {
    ...projectResult.rows[0],
    categories: categoriesResult.rows
  };
}