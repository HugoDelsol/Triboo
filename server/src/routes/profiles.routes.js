// server/src/routes/profiles.routes.js
import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { createProfileRules, selectProfileRules, profileIdParamRule } from '../validators/profiles.validator.js';
import { getProfiles, createProfile, selectProfile, removeProfile } from '../controllers/profiles.controller.js';

const router = Router();

router.get('/', getProfiles);
router.post('/', createProfileRules, validate, createProfile);
router.post('/select', selectProfileRules, validate, selectProfile);
router.delete('/:id', profileIdParamRule, validate, removeProfile);

export default router;