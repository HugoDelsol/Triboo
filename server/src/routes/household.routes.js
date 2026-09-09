// server/src/routes/household.routes.js
import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

router.post('/', async (req, res) => {
    const { password_hash } = req.body;

    if (!password_hash) {
        return res.status(400).json({ message: 'password_hash est requis' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO household (password_hash) VALUES (?)',
            [password_hash]
        );

        res.status(201).json({ id: result.insertId, message: 'Foyer créé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;