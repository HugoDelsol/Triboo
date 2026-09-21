// server/src/middlewares/rateLimit.js
import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 tentatives max par fenêtre
    message: { message: 'Trop de tentatives, réessaie plus tard' },
});