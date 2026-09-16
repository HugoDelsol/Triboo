// server/src/repositories/reminder.repository.js
import { pool } from '../config/database.js';

export async function insertReminder(taskId, profileId, scheduledAt) {
    await pool.query(
        `INSERT INTO reminders (task_id, profile_id, scheduled_at) VALUES (?, ?, ?)`,
        [taskId, profileId, scheduledAt]
    );
}

export async function findPendingReminders() {
    const [rows] = await pool.query(
        `SELECT r.id, r.task_id, r.profile_id, t.title, t.type
     FROM reminders r
     JOIN tasks t ON t.id = r.task_id
     WHERE r.status = 'pending' AND r.scheduled_at <= NOW()`
    );
    return rows;
}

export async function markReminderSent(reminderId) {
    await pool.query(
        `UPDATE reminders SET status = 'sent', sent_at = NOW() WHERE id = ?`,
        [reminderId]
    );
}

export async function markReminderFailed(reminderId) {
    await pool.query(
        `UPDATE reminders SET status = 'failed' WHERE id = ?`,
        [reminderId]
    );
}