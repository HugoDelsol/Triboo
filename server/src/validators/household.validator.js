// server/src/validators/household.validator.js
import { body } from 'express-validator';

export const signupRules = [
    body('name').trim().notEmpty().withMessage('Le nom du foyer est requis').isLength({ max: 100 }),
    body('password').notEmpty().withMessage('Le mot de passe est requis').isLength({ min: 4 }).withMessage('Mot de passe trop court'),
];

export const loginRules = [
    body('name').trim().notEmpty().withMessage('Le nom du foyer est requis'),
    body('password').notEmpty().withMessage('Le mot de passe est requis'),
];