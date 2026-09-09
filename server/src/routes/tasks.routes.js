// server/src/routes/tasks.routes.js
import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT
        t.id, t.type, t.title, t.description,
        t.due_date, t.due_time, t.location,
        t.priority, t.status,
        c.name AS category_name, c.color AS category_color
      FROM tasks t
      LEFT JOIN categories c ON c.id = t.category_id
      ORDER BY t.due_date ASC
    `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const {
        household_id, category_id, created_by_profile_id,
        type, title, description,
        due_date, due_time, location,
        reminder_offsets, priority,
    } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Le titre est requis' });
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO tasks
        (household_id, category_id, created_by_profile_id, type, title, description,
         due_date, due_time, location, reminder_offsets, priority, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                household_id, category_id ?? null, created_by_profile_id,
                type, title.trim(), description ?? null,
                due_date ?? null, due_time ?? null, location ?? null,
                JSON.stringify(reminder_offsets ?? []), priority ?? 'important',
            ]
        );

        res.status(201).json({ id: result.insertId, message: 'Tâche créée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status, title, description, due_date, priority, category_id } = req.body;

    try {
        const [existing] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Tâche introuvable' });
        }

        const current = existing[0];
        const overdueNotified = due_date && due_date !== current.due_date
            ? false
            : current.overdue_notified;

        await pool.query(
            `UPDATE tasks
       SET status = ?, title = ?, description = ?, due_date = ?, priority = ?,
           category_id = ?, overdue_notified = ?
       WHERE id = ?`,
            [
                status ?? current.status,
                title ?? current.title,
                description ?? current.description,
                due_date ?? current.due_date,
                priority ?? current.priority,
                category_id ?? current.category_id,
                overdueNotified,
                id,
            ]
        );

        res.json({ message: 'Tâche mise à jour' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tâche introuvable' });
        }

        res.json({ message: 'Tâche supprimée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;