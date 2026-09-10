// server/src/routes/household.routes.js
import { Router } from 'express';
import { login, signup, me, logout } from '../controllers/household.controller.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', me);
router.post('/logout', logout);

export default router;