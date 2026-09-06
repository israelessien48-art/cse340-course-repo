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