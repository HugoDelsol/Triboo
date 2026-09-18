// server/src/controllers/recurringTasks.controller.js
import { insertTemplate, updateTemplateDetails } from '../repositories/recurringTemplate.repository.js';
import { insertTask, findTaskTemplateId, updateTaskDetails } from '../repositories/task.repository.js';
import { insertReminder } from '../repositories/reminder.repository.js';
import { findProfilesByHousehold } from '../repositories/profile.repository.js';
import { buildReminderDates } from '../utils/reminderDates.js';

export async function createRecurringTask(req, res) {

    const {
        title, description, category_id, due_date,
        recurrence_type, recurrence_interval, recurrence_day, recurrence_month,
        wants_reminder, is_shared,
    } = req.body;

    if (!title?.trim()) {
        return res.status(400).json({ message: 'Le titre est requis' });
    }
    if (!due_date) {
        return res.status(400).json({ message: 'Une date de départ est requise' });
    }
    if (!['daily', 'weekly', 'monthly', 'yearly'].includes(recurrence_type)) {
        return res.status(400).json({ message: 'Type de récurrence invalide' });
    }

    try {
        const templateId = await insertTemplate({
            household_id: req.householdId,
            category_id: category_id ?? null,
            created_by_profile_id: req.session.profileId,
            title: title.trim(),
            description: description?.trim() || null,
            recurrence_type,
            recurrence_interval: recurrence_interval ?? 1,
            recurrence_day,
            recurrence_month: recurrence_month ?? null,
            wants_reminder: wants_reminder ?? false,
            last_generated_date: due_date,
        });

        const taskId = await insertTask({
            household_id: req.householdId,
            category_id: category_id ?? null,
            template_id: templateId,
            period_key: due_date,
            created_by_profile_id: req.session.profileId,
            type: 'task',
            title: title.trim(),
            description: description?.trim() || null,
            due_date,
            due_time: null,
            location: null,
            priority: 'important',
            is_shared: is_shared ?? true,
            wants_reminder: wants_reminder ?? false,
        });

        const { dayOf, the24hBefore } = buildReminderDates(due_date, null);
        const targetProfileIds = (is_shared ?? true)
            ? (await findProfilesByHousehold(req.householdId)).map((p) => p.id)
            : [req.session.profileId];

        for (const profileId of targetProfileIds) {
            await insertReminder(taskId, profileId, dayOf);
            if (wants_reminder) {
                await insertReminder(taskId, profileId, the24hBefore);
            }
        }

        res.status(201).json({ templateId, taskId, message: 'Tâche récurrente créée' });
    } catch (error) {
        console.error('Erreur createRecurringTask:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function editTaskRecurring(req, res) {
    try {
        const templateId = await findTaskTemplateId(req.params.id, req.householdId);
        if (!templateId) return res.status(404).json({ message: 'Template introuvable' });

        const templateUpdated = await updateTemplateDetails(templateId, req.householdId, req.body);
        if (!templateUpdated) return res.status(404).json({ message: 'Template introuvable' });

        const taskUpdated = await updateTaskDetails(req.params.id, req.householdId, {
            ...req.body,
            priority: "important",
        });
        if (!taskUpdated) return res.status(404).json({ message: 'Tâche introuvable' });

        res.json({ message: 'Tâche récurrente mise à jour' });
    } catch (error) {
        console.error('Erreur editTaskRecurring:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}