import db from "./db.js";

export async function getAllCategories() {
  const { rows } = await db.query(`
    SELECT
      category_id,
      name
    FROM category
    ORDER BY category_id;
  `);

  return rows;
}

export async function getCategoryDetails(id) {
  const categoryQuery = `
    SELECT
      category_id,
      name
    FROM category
    WHERE category_id = $1;
  `;

  const projectsQuery = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.date,
      TO_CHAR(p.date, 'FMMonth FMDD, YYYY') AS formatted_date
    FROM project AS p
    JOIN project_category AS pc
      ON p.project_id = pc.project_id
    WHERE pc.category_id = $1
    ORDER BY p.date, p.project_id;
  `;

  const categoryResult = await db.query(categoryQuery, [id]);

  if (categoryResult.rows.length === 0) {
    return null;
  }

  const projectsResult = await db.query(projectsQuery, [id]);

  return {
    ...categoryResult.rows[0],
    projects: projectsResult.rows
  };
}