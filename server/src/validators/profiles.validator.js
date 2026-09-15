// server/src/validators/profiles.validator.js
import { body, param } from 'express-validator';

export const createProfileRules = [
    body('name').trim().notEmpty().withMessage('Le prénom est requis').isLength({ max: 100 }),
];

export const selectProfileRules = [
    body('profileId').isInt().withMessage('Identifiant de profil invalide'),
];

export const profileIdParamRule = [
    param('id').isInt().withMessage('Identifiant de profil invalide'),
];