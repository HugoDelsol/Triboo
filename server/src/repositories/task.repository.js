// server/src/repositories/task.repository.js
import { pool } from '../config/database.js';

export async function findAllTasks(householdId) {
    const [rows] = await pool.query(
        `SELECT t.*, c.name AS category_name, c.color AS category_color
     FROM tasks t
     LEFT JOIN categories c ON c.id = t.category_id
     WHERE t.household_id = ?
     ORDER BY t.due_date ASC`,
        [householdId]
    );
    return rows;
}

export async function findTaskById(id, householdId) {
    const [rows] = await pool.query(
        `SELECT t.*, c.name AS category_name, c.color AS category_color
     FROM tasks t
     LEFT JOIN categories c ON c.id = t.category_id
     WHERE t.id = ? AND t.household_id = ?`,
        [id, householdId]
    );
    return rows[0] || null;
}

export async function insertTask(data) {
    const [result] = await pool.query(
        `INSERT INTO tasks
      (household_id, category_id, type, title, description, due_date, due_time, location, priority, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [data.household_id, data.category_id, data.type, data.title, data.description, data.due_date, data.due_time, data.location, data.priority]
    );
    return result.insertId;
}

export async function updateTaskStatus(id, householdId, status) {
    const [result] = await pool.query(
        `UPDATE tasks SET status = ? WHERE id = ? AND household_id = ?`,
        [status, id, householdId]
    );
    return result.affectedRows > 0;
}

export async function deleteTask(id, householdId) {
    const [result] = await pool.query(
        `DELETE FROM tasks WHERE id = ? AND household_id = ?`,
        [id, householdId]
    );
    return result.affectedRows > 0;
}