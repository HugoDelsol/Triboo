// server/src/routes/profiles.routes.js
import { Router } from 'express';
import { getProfiles, createProfile, selectProfile } from '../controllers/profiles.controller.js';

const router = Router();

router.get('/', getProfiles);
router.post('/', createProfile);
router.post('/select', selectProfile);

export default router;