// server/src/controllers/tasks.controller.js
import {
    findAllTasks,
    findTaskById,
    insertTask,
    updateTaskStatus,
    deleteTask,
    findTaskTemplateId,
    updateTaskDetails,
} from '../repositories/task.repository.js';
import { insertReminder } from '../repositories/reminder.repository.js';
import { findProfilesByHousehold } from '../repositories/profile.repository.js';
import { buildReminderDates } from '../utils/reminderDates.js';
import { deleteTemplateAndOccurrences, updateTemplateDetails } from '../repositories/recurringTemplate.repository.js';
import { findCategoryById } from '../repositories/category.repository.js';

export async function getAllTasks(req, res) {
    try {
        const tasks = await findAllTasks(req.householdId, req.session.profileId);
        res.json(tasks);
    } catch (error) {
        console.error('Erreur getAllTasks:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function getTaskById(req, res) {
    try {
        const task = await findTaskById(req.params.id, req.householdId);
        if (!task) return res.status(404).json({ message: 'Tâche introuvable' });
        res.json(task);
    } catch (error) {
        console.error('Erreur getTaskById:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function createTask(req, res) {
    const { title, type } = req.body;

    if (!title?.trim()) {
        return res.status(400).json({ message: 'Le titre est requis' });
    }
    if (!type) {
        return res.status(400).json({ message: 'Le type est requis' });
    }
    if (req.body.category_id) {
        const category = await findCategoryById(req.body.category_id, req.householdId);
        if (!category) return res.status(400).json({ message: 'Catégorie invalide' });
    }

    try {
        const id = await insertTask({
            ...req.body,
            household_id: req.householdId,
            created_by_profile_id: req.session.profileId,
            is_shared: req.body.is_shared ?? true,
            template_id: null,
            period_key: null,
        });

        if (req.body.due_date) {
            const { dayOf, the24hBefore } = buildReminderDates(req.body.due_date, req.body.due_time);

            const targetProfileIds = req.body.is_shared
                ? (await findProfilesByHousehold(req.householdId)).map((p) => p.id)
                : [req.session.profileId];

            for (const profileId of targetProfileIds) {
                await insertReminder(id, profileId, dayOf);
                if (req.body.wants_reminder) {
                    await insertReminder(id, profileId, the24hBefore);
                }
            }
        }

        res.status(201).json({ id, message: 'Tâche créée' });
    } catch (error) {
        console.error('Erreur createTask:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function updateTask(req, res) {
    
    try {
        const updated = await updateTaskStatus(req.params.id, req.householdId, req.body.status);
        if (!updated) return res.status(404).json({ message: 'Tâche introuvable' });
        res.json({ message: 'Tâche mise à jour' });
    } catch (error) {
        console.error('Erreur updateTask:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function editTask(req, res) {

    if (req.body.category_id) {
        const category = await findCategoryById(req.body.category_id, req.householdId);
        if (!category) return res.status(400).json({ message: 'Catégorie invalide' });
    }
    try {
        const updated = await updateTaskDetails(req.params.id, req.householdId, req.body);
        if (!updated) return res.status(404).json({ message: 'Tâche introuvable' });
        res.json({ message: 'Tâche mise à jour' });
    } catch (error) {
        console.error('Erreur editTask:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function removeTask(req, res) {
    try {
        const templateId = await findTaskTemplateId(req.params.id, req.householdId);

        if (templateId) {
            await deleteTemplateAndOccurrences(templateId, req.householdId);
            return res.json({ message: 'Tâche récurrente et toutes ses occurrences supprimées' });
        }

        const deleted = await deleteTask(req.params.id, req.householdId);
        if (!deleted) return res.status(404).json({ message: 'Tâche introuvable' });
        res.json({ message: 'Tâche supprimée' });
    } catch (error) {
        console.error('Erreur removeTask:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}