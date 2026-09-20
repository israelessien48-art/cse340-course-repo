import db from "./db.js";

export const addVolunteer = async (userId, projectId) => {
  const result = await db.query(
    `
      INSERT INTO project_volunteers
        (user_id, project_id)
      VALUES
        ($1, $2)
      ON CONFLICT (user_id, project_id) DO NOTHING
      RETURNING user_id, project_id;
    `,
    [userId, projectId]
  );

  return result.rows[0];
};

export const removeVolunteer = async (userId, projectId) => {
  const result = await db.query(
    `
      DELETE FROM project_volunteers
      WHERE user_id = $1
        AND project_id = $2
      RETURNING user_id, project_id;
    `,
    [userId, projectId]
  );

  return result.rows[0];
};

export const getVolunteerProjects = async (userId) => {
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
      FROM project_volunteers AS pv
      JOIN project AS p
        ON pv.project_id = p.project_id
      JOIN organization AS o
        ON p.organization_id = o.organization_id
      WHERE pv.user_id = $1
      ORDER BY p.date, p.project_id;
    `,
    [userId]
  );

  return rows;
};

export const isUserVolunteer = async (userId, projectId) => {
  const { rows } = await db.query(
    `
      SELECT user_id, project_id
      FROM project_volunteers
      WHERE user_id = $1
        AND project_id = $2;
    `,
    [userId, projectId]
  );

  return rows.length > 0;
};