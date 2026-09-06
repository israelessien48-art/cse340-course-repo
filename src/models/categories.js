import db from "./db.js";

export async function getAllCategories() {
    const { rows } = await db.query(`
        SELECT category_id, name
        FROM category
        ORDER BY category_id;
    `);

    return rows;
}
