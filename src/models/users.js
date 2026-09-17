import pool from "./db.js";

export async function getUserByEmail(email) {
  const result = await pool.query(
    `SELECT user_id, name, email, password_hash, role_id
     FROM users
     WHERE email = $1`,
    [email]
  );

  return result.rows[0];
}

export async function getUserById(userId) {
  const result = await pool.query(
    `SELECT u.user_id, u.name, u.email, u.role_id, r.role_name
     FROM users u
     JOIN roles r ON u.role_id = r.role_id
     WHERE u.user_id = $1`,
    [userId]
  );

  return result.rows[0];
}

export async function getAllUsers() {
  const result = await pool.query(
    `SELECT u.user_id, u.name, u.email, r.role_name
     FROM users u
     JOIN roles r ON u.role_id = r.role_id
     ORDER BY u.user_id`
  );

  return result.rows;
}

export async function createUser(name, email, passwordHash, roleId = 1) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, role_id)
     VALUES ($1, $2, $3, $4)
     RETURNING user_id, name, email, role_id`,
    [name, email, passwordHash, roleId]
  );

  return result.rows[0];
}