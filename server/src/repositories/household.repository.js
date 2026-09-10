// server/src/repositories/household.repository.js
import { pool } from '../config/database.js';

export async function insertHousehold(name, hashedPassword) {
    const [result] = await pool.query(
        `INSERT INTO household (name, password_hash) VALUES (?, ?)`,
        [name, hashedPassword]
    );
    return result.insertId;
}

export async function findHouseholdByName(name) {
    const [rows] = await pool.query(
        `SELECT id, name, password FROM household WHERE name = ?`,
        [name]
    );
    return rows[0] || null;
}

export async function findHouseholdById(id) {
    const [rows] = await pool.query(
        `SELECT id, name FROM household WHERE id = ?`,
        [id]
    );
    return rows[0] || null;
}

export async function updateHouseholdPassword(id, hashedPassword) {
    await pool.query(
        `UPDATE household SET password = ? WHERE id = ?`,
        [hashedPassword, id]
    );
}