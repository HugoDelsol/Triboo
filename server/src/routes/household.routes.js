// server/src/routes/household.routes.js
import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { signupRules, loginRules } from '../validators/household.validator.js';
import { login, signup, me, logout } from '../controllers/household.controller.js';

const router = Router();

router.post('/signup', signupRules, validate, signup);
router.post('/login', loginRules, validate, login);
router.get('/me', me);
router.post('/logout', logout);

export default router;