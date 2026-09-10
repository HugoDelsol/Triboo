// server/src/routes/profiles.routes.js
import { Router } from 'express';
import { getProfiles, createProfile, selectProfile, removeProfile } from '../controllers/profiles.controller.js';

const router = Router();

router.get('/', getProfiles);
router.post('/', createProfile);
router.post('/select', selectProfile);
router.delete('/:id', removeProfile);

export default router;