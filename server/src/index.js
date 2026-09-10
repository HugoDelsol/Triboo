// server/src/index.js
import './loadEnv.js';
import express from 'express';
import cors from 'cors';

import { sessionMiddleware } from './config/session.js';
import { requireAuth } from './middlewares/requireAuth.js';

import tasksRouter from './routes/tasks.routes.js';
import householdRouter from './routes/household.routes.js';
import profilesRouter from './routes/profiles.routes.js';
import categoriesRouter from './routes/categories.routes.js';

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // indispensable pour que le cookie de session soit envoyé/reçu
}));
app.use(express.json());
app.use(sessionMiddleware);

app.use('/api/tasks', requireAuth, tasksRouter);
app.use('/api/households', householdRouter);
app.use('/api/profiles', requireAuth, profilesRouter);
app.use('/api/categories', requireAuth, categoriesRouter);

app.use((err, req, res, next) => {
    console.error('Erreur non gérée:', err);
    res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});