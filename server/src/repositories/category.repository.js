// server/src/repositories/category.repository.js
import { pool } from '../config/database.js';

export async function findAllCategories(householdId) {
    const [rows] = await pool.query(
        `SELECT id, name, color FROM categories WHERE household_id = ?`,
        [householdId]
    );
    return rows;
}

export async function findCategoryById(id, householdId) {
    const [rows] = await pool.query(
        `SELECT id, name, color FROM categories WHERE id = ? AND household_id = ?`,
        [id, householdId]
    );
    return rows[0] || null;
}

export async function insertCategory(householdId, name, color) {
    const [result] = await pool.query(
        `INSERT INTO categories (household_id, name, color) VALUES (?, ?, ?)`,
        [householdId, name, color]
    );
    return result.insertId;
}

export async function updateCategory(id, householdId, name, color) {
    const [result] = await pool.query(
        `UPDATE categories SET name = ?, color = ? WHERE id = ? AND household_id = ?`,
        [name, color, id, householdId]
    );
    return result.affectedRows > 0;
}

export async function countTasksUsingCategory(id, householdId) {
    const [rows] = await pool.query(
        `SELECT COUNT(*) AS count FROM tasks WHERE category_id = ? AND household_id = ?`,
        [id, householdId]
    );
    return rows[0].count;
}

export async function deleteCategory(id, householdId) {
    const [result] = await pool.query(
        `DELETE FROM categories WHERE id = ? AND household_id = ?`,
        [id, householdId]
    );
    return result.affectedRows > 0;
}