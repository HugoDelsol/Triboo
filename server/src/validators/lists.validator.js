// server/src/validators/lists.validator.js
import { body, param } from 'express-validator';

export const createListRules = [
    body('title').trim().notEmpty().withMessage('Le titre de la liste est requis').isLength({ max: 200 }),
    body('category_id').optional({ nullable: true }).isInt().withMessage('Catégorie invalide'),
];

export const listIdParamRule = [
    param('id').isInt().withMessage('Identifiant invalide'),
];

export const createListItemRules = [
    param('listId').isInt().withMessage('Identifiant de liste invalide'),
    body('label').trim().notEmpty().withMessage("Le nom de l'article est requis").isLength({ max: 200 }),
];

export const editListItemRules = [
    param('listId').isInt().withMessage('Identifiant de liste invalide'),
    param('itemId').isInt().withMessage("Identifiant d'article invalide"),
    body('is_checked').isBoolean().withMessage('Valeur invalide'),
];

export const listItemParamsRule = [
    param('listId').isInt().withMessage('Identifiant de liste invalide'),
    param('itemId').isInt().withMessage("Identifiant d'article invalide"),
];