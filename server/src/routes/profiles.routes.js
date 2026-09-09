// server/src/routes/profiles.routes.js
import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

router.post('/', async (req, res) => {
    const { household_id, name } = req.body;

    if (!household_id || !name) {
        return res.status(400).json({ message: 'household_id et name sont requis' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO profiles (household_id, name) VALUES (?, ?)',
            [household_id, name.trim()]
        );

        res.status(201).json({ id: result.insertId, message: 'Profil créé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;