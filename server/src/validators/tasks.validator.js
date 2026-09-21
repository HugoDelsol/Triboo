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

export const createRecurringTaskRules = [
    body('title').trim().notEmpty().withMessage('Le titre est requis').isLength({ max: 200 }),
    body('description').optional({ nullable: true }).trim(),
    body('category_id').optional({ nullable: true }).isInt().withMessage('Catégorie invalide'),
    body('due_date').notEmpty().withMessage('Une date de départ est requise').isISO8601().withMessage('Date invalide'),
    body('recurrence_type').isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Type de récurrence invalide'),
    body('recurrence_interval').optional().isInt({ min: 1 }).withMessage('Intervalle invalide'),
    body('recurrence_day')
        .if(body('recurrence_type').isIn(['weekly', 'monthly', 'yearly']))
        .notEmpty().withMessage('Le jour de récurrence est requis')
        .isInt({ min: 1, max: 31 }).withMessage('Jour invalide'),
    body('recurrence_month')
        .if(body('recurrence_type').equals('yearly'))
        .notEmpty().withMessage('Le mois de récurrence est requis pour une récurrence annuelle')
        .isInt({ min: 1, max: 12 }).withMessage('Mois invalide'),
    body('is_shared').optional().isBoolean(),
    body('wants_reminder').optional().isBoolean(),
];

export const editTaskDetailsRules = [
    param('id').isInt().withMessage('Identifiant invalide'),
    body('title').trim().notEmpty().withMessage('Le titre est requis').isLength({ max: 200 }),
    body('description').optional({ nullable: true }).trim(),
    body('category_id').optional({ nullable: true }).isInt().withMessage('Catégorie invalide'),
    body('due_date').optional({ nullable: true }).isISO8601().withMessage('Date invalide'),
    body('due_time').optional({ nullable: true }).matches(/^\d{2}:\d{2}(:\d{2})?$/).withMessage('Heure invalide'),
    body('location').optional({ nullable: true }).trim().isLength({ max: 255 }),
    body('priority').isIn(['urgent', 'important', 'faible']).withMessage('Priorité invalide'),
    body('is_shared').optional().isBoolean(),
    body('wants_reminder').optional().isBoolean(),
];

export const editTaskRecurringRules = [
    param('id').isInt().withMessage('Identifiant invalide'),
    body('title').trim().notEmpty().withMessage('Le titre est requis').isLength({ max: 200 }),
    body('description').optional({ nullable: true }).trim(),
    body('category_id').optional({ nullable: true }).isInt().withMessage('Catégorie invalide'),
    body('recurrence_type').isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Type de récurrence invalide'),
    body('recurrence_interval').isInt({ min: 1 }).withMessage('Intervalle invalide'),
    body('recurrence_day')
        .if(body('recurrence_type').isIn(['weekly', 'monthly', 'yearly']))
        .notEmpty().withMessage('Le jour de récurrence est requis')
        .isInt({ min: 1, max: 31 }).withMessage('Jour invalide'),
    body('recurrence_month')
        .if(body('recurrence_type').equals('yearly'))
        .notEmpty().withMessage('Le mois de récurrence est requis pour une récurrence annuelle')
        .isInt({ min: 1, max: 12 }).withMessage('Mois invalide'),
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