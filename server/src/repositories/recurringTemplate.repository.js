// server/src/repositories/recurringTemplate.repository.js
import { pool } from '../config/database.js';

export async function findAllTemplates() {
    const [rows] = await pool.query(`SELECT * FROM recurring_task_templates`);
    return rows;
}

export async function updateLastGeneratedDate(templateId, date) {
    await pool.query(
        `UPDATE recurring_task_templates SET last_generated_date = ? WHERE id = ?`,
        [date, templateId]
    );
}
export async function insertTemplate(data) {
    const [result] = await pool.query(
        `INSERT INTO recurring_task_templates
      (household_id, category_id, created_by_profile_id, title, description, recurrence_type, recurrence_interval, recurrence_day, recurrence_month, wants_reminder, last_generated_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.household_id,
            data.category_id,
            data.created_by_profile_id,
            data.title,
            data.description,
            data.recurrence_type,
            data.recurrence_interval,
            data.recurrence_day,
            data.recurrence_month,
            data.wants_reminder,
            data.last_generated_date,
        ]
    );
    return result.insertId;
}

export async function updateTemplateDetails(templateId, householdId, data) {
    const [result] = await pool.query(
        `UPDATE recurring_task_templates
     SET title = ?, description = ?, category_id = ?, recurrence_type = ?, recurrence_interval = ?, recurrence_day = ?, recurrence_month = ?, wants_reminder = ?
     WHERE id = ? AND household_id = ?`,
        [
            data.title,
            data.description,
            data.category_id,
            data.recurrence_type,
            data.recurrence_interval,
            data.recurrence_day,
            data.recurrence_month,
            data.wants_reminder,
            templateId,
            householdId,
        ]
    );
    return result.affectedRows > 0;
}

export async function deleteTemplateAndOccurrences(templateId, householdId) {
    await pool.query(
        `DELETE FROM tasks WHERE template_id = ? AND household_id = ?`,
        [templateId, householdId]
    );
    await pool.query(
        `DELETE FROM recurring_task_templates WHERE id = ? AND household_id = ?`,
        [templateId, householdId]
    );
}