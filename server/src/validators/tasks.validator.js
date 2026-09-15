// server/src/validators/tasks.validator.js
import { body, param } from 'express-validator';

export const createTaskRules = [
    body('title').trim().notEmpty().withMessage('Le titre est requis').isLength({ max: 200 }),
    body('type').isIn(['task', 'memo', 'appointment']).withMessage('Type invalide'),
    body('description').optional({ nullable: true }).trim(),
    body('due_date').optional({ nullable: true }).isISO8601().withMessage('Date invalide'),
    body('due_time').optional({ nullable: true }).matches(/^\d{2}:\d{2}(:\d{2})?$/).withMessage('Heure invalide'),
    body('location').optional({ nullable: true }).trim().isLength({ max: 255 }),
    body('priority').optional().isIn(['urgent', 'important', 'faible']).withMessage('Priorité invalide'),
    body('category_id').optional({ nullable: true }).isInt().withMessage('Catégorie invalide'),
    body('is_shared').optional().isBoolean(),
    body('wants_reminder').optional().isBoolean(),
];

export const updateTaskRules = [
    param('id').isInt().withMessage('Identifiant invalide'),
    body('status').isIn(['pending', 'done']).withMessage('Statut invalide'),
];

export const taskIdParamRule = [
    param('id').isInt().withMessage('Identifiant invalide'),
];