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
  const { rows } = await db.query(
    `
      SELECT
        category_id,
        name
      FROM category
      WHERE category_id = $1;
    `,
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}

export async function getProjectsByCategoryId(id) {
  const { rows } = await db.query(
    `
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
    `,
    [id]
  );

  return rows;
}