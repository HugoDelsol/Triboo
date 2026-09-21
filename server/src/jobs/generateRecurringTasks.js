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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const template of templates) {
        let nextDate = computeNextOccurrenceDate(template);

        while (nextDate <= today || !template.last_generated_date) {
            const periodKey = formatDate(nextDate);

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

            const { dayOf, the24hBefore } = buildReminderDates(periodKey, null);
            const targetProfileIds = (await findProfilesByHousehold(template.household_id)).map((p) => p.id);

            for (const profileId of targetProfileIds) {
                await insertReminder(taskId, profileId, dayOf);
                if (template.wants_reminder) {
                    await insertReminder(taskId, profileId, the24hBefore);
                }
            }

            await updateLastGeneratedDate(template.id, periodKey);

            template.last_generated_date = periodKey;
            nextDate = computeNextOccurrenceDate(template);

            if (nextDate > today) break;
        }
    }
}

export function startRecurringTaskCron() {
    cron.schedule('0 6 * * *', generateOccurrences);
}