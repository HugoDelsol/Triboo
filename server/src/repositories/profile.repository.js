// server/src/repositories/profile.repository.js
import { pool } from '../config/database.js';

export async function findProfilesByHousehold(householdId) {
    const [rows] = await pool.query(
        `SELECT id, name, avatar_url FROM profiles WHERE household_id = ?`,
        [householdId]
    );
    return rows;
}

export async function findProfileById(id, householdId) {
    const [rows] = await pool.query(
        `SELECT id, name, avatar_url FROM profiles WHERE id = ? AND household_id = ?`,
        [id, householdId]
    );
    return rows[0] || null;
}

export async function insertProfile(householdId, name, avatarUrl = null) {
    const [result] = await pool.query(
        `INSERT INTO profiles (household_id, name, avatar_url) VALUES (?, ?, ?)`,
        [householdId, name, avatarUrl]
    );
    return result.insertId;
}