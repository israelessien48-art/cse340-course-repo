import db from "./db.js";

export const getAllCategories = async () => {
  const { rows } = await db.query(`
    SELECT
      category_id,
      name
    FROM category
    ORDER BY category_id;
  `);

  return rows;
};

export const getCategoryDetails = async (id) => {
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
};

export const getProjectsByCategoryId = async (id) => {
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
};

export const createCategory = async (name) => {
  const result = await db.query(
    `
      INSERT INTO category
        (name)
      VALUES
        ($1)
      RETURNING category_id;
    `,
    [name]
  );

  return result.rows[0];
};

export const updateCategory = async (category_id, name) => {
  const result = await db.query(
    `
      UPDATE category
      SET
        name = $1
      WHERE category_id = $2
      RETURNING category_id;
    `,
    [name, category_id]
  );

  if (result.rows.length === 0) {
    throw new Error("Category update failed.");
  }

  return result.rows[0];
};