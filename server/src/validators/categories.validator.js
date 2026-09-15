// server/src/validators/categories.validator.js
import { body, param } from 'express-validator';

export const createCategoryRules = [
    body('name').trim().notEmpty().withMessage('Le nom est requis').isLength({ max: 100 }),
    body('color').trim().notEmpty().withMessage('La couleur est requise').isHexColor().withMessage('Couleur invalide'),
];

export const editCategoryRules = [
    param('id').isInt().withMessage('Identifiant invalide'),
    body('name').trim().notEmpty().withMessage('Le nom est requis').isLength({ max: 100 }),
    body('color').trim().notEmpty().withMessage('La couleur est requise').isHexColor().withMessage('Couleur invalide'),
];

export const categoryIdParamRule = [
    param('id').isInt().withMessage('Identifiant invalide'),
];