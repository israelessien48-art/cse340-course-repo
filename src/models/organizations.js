import db from "./db.js";

export async function getAllOrganizations() {
    const { rows } = await db.query(`
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM organization
        ORDER BY organization_id;
    `);

    return rows;
}