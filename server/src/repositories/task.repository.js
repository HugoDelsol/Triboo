// server/src/repositories/task.repository.js
import { pool } from '../config/database.js';

export async function findAllTasks(householdId, profileId) {
    const [rows] = await pool.query(
        `SELECT t.*, c.name AS category_name, c.color AS category_color,
            rt.recurrence_type, rt.recurrence_interval
     FROM tasks t
     LEFT JOIN categories c ON c.id = t.category_id
     LEFT JOIN recurring_task_templates rt ON rt.id = t.template_id
     WHERE t.household_id = ?
       AND (t.is_shared = TRUE OR t.created_by_profile_id = ?)
     ORDER BY t.due_date ASC`,
        [householdId, profileId]
    );
    return rows;
}

export async function findTaskById(id, householdId) {
    const [rows] = await pool.query(
        `SELECT t.*, c.name AS category_name, c.color AS category_color,
            rt.recurrence_type, rt.recurrence_interval
     FROM tasks t
     LEFT JOIN categories c ON c.id = t.category_id
     LEFT JOIN recurring_task_templates rt ON rt.id = t.template_id
     WHERE t.id = ? AND t.household_id = ?`,
        [id, householdId]
    );
    return rows[0] || null;
}

export async function insertTask(data) {
    const [result] = await pool.query(
        `INSERT INTO tasks
      (household_id, created_by_profile_id, category_id, template_id, period_key, type, title, description, due_date, due_time, location, priority, status, is_shared, wants_reminder)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
        [
            data.household_id,
            data.created_by_profile_id,
            data.category_id,
            data.template_id ?? null,
            data.period_key ?? null,
            data.type,
            data.title,
            data.description,
            data.due_date,
            data.due_time,
            data.location,
            data.priority,
            data.is_shared,
            data.wants_reminder,
        ]
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

export async function findTaskTemplateId(id, householdId) {
  const [rows] = await pool.query(
    `SELECT template_id FROM tasks WHERE id = ? AND household_id = ?`,
    [id, householdId]
  );
  return rows[0]?.template_id ?? null;
}