// server/src/jobs/generateRecurringTasks.js
import cron from 'node-cron';
import { findAllTemplates, updateLastGeneratedDate } from '../repositories/recurringTemplate.repository.js';
import { insertTask } from '../repositories/task.repository.js';
import { insertReminder } from '../repositories/reminder.repository.js';
import { findProfilesByHousehold } from '../repositories/profile.repository.js';
import { computeNextOccurrenceDate } from '../utils/recurrenceDates.js';
import { buildReminderDates } from '../utils/reminderDates.js';

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

async function generateOccurrences() {
    const templates = await findAllTemplates();

    // Aujourd'hui à minuit, pour comparer des dates et non des heures
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const template of templates) {
        // Tant que la DERNIÈRE occurrence générée est dépassée (strictement avant
        // aujourd'hui), on crée la suivante. Dès que la dernière générée est
        // aujourd'hui ou dans le futur, la boucle s'arrête d'elle-même.
        // Le "||" couvre un template qui n'a encore jamais rien généré.
        // Cette condition est relue à chaque tour, car last_generated_date
        // est mise à jour en fin de boucle.
        while (!template.last_generated_date || new Date(template.last_generated_date) < today) {
            const previousDate = template.last_generated_date;

            // Date de la prochaine occurrence, calculée depuis la dernière générée
            const nextDate = computeNextOccurrenceDate(template);
            const periodKey = formatDate(nextDate);

            // Garde-fou : si la date n'avance pas (ex: recurrence_interval à 0),
            // on sort, sinon la boucle ne s'arrêterait jamais.
            if (previousDate && periodKey <= previousDate) break;

            const taskId = await insertTask({
                household_id: template.household_id,
                category_id: template.category_id,
                template_id: template.id,
                period_key: periodKey,
                created_by_profile_id: template.created_by_profile_id,
                type: 'task',
                title: template.title,
                description: template.description,
                due_date: periodKey,
                due_time: null,
                location: null,
                priority: 'important',
                is_shared: true,
                wants_reminder: template.wants_reminder,
            });

            // Rappels : jour J pour tous, et 24h avant si demandé
            const { dayOf, the24hBefore } = buildReminderDates(periodKey, null);
            const profiles = await findProfilesByHousehold(template.household_id);

            for (const profile of profiles) {
                await insertReminder(taskId, profile.id, dayOf);
                if (template.wants_reminder) {
                    await insertReminder(taskId, profile.id, the24hBefore);
                }
            }

            // On avance le curseur : c'est ce qui fait évoluer la condition du while
            await updateLastGeneratedDate(template.id, periodKey);
            template.last_generated_date = periodKey;
        }
    }
}

export function startRecurringTaskCron() {
    cron.schedule('0 6 * * *', generateOccurrences, {
        timezone: 'Europe/Paris',
    });
}
