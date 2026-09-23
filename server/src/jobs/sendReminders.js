// server/src/jobs/sendReminders.js
import cron from 'node-cron';
import { findPendingReminders, markReminderSent, markReminderFailed } from '../repositories/reminder.repository.js';
import { findSubscriptionsByProfileId } from '../repositories/pushSubscription.repository.js';
import { sendPushNotification } from '../utils/sendPush.js';

async function processReminders() {
    const reminders = await findPendingReminders();

    for (const reminder of reminders) {
        const subscriptions = await findSubscriptionsByProfileId(reminder.profile_id);

        if (subscriptions.length === 0) {
            await markReminderFailed(reminder.id);
            continue;
        }

        let atLeastOneSucceeded = false;

        for (const sub of subscriptions) {
            const success = await sendPushNotification(
                {
                    endpoint: sub.endpoint,
                    keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
                },
                {
                    title: 'Triboo',
                    body: `Rappel : ${reminder.title}`,
                }
            );
            if (success) atLeastOneSucceeded = true;
        }

        if (atLeastOneSucceeded) {
            await markReminderSent(reminder.id);
        } else {
            await markReminderFailed(reminder.id);
        }
    }
}

export function startReminderCron() {
    cron.schedule('*/15 * * * *', processReminders, {
        timezone:  'Europe/Paris',
    });
}