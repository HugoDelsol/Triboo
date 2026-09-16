// server/src/routes/push.routes.js
import { Router } from 'express';
import { subscribe } from '../controllers/push.controller.js';

const router = Router();

router.post('/subscribe', subscribe);

export default router;