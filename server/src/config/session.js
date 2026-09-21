// server/src/config/session.js
import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
import { pool } from './database.js';

const MySQLStore = MySQLStoreFactory(session);

const sessionStore = new MySQLStore({}, pool);

export const sessionMiddleware = session({
    key: 'triboo_session',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true, // renouvelle l'expiration à chaque requête
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours en millisecondes
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    },
});