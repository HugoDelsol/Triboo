// server/src/utils/recurrenceDates.js

function getLastDayOfMonth(year, month) {
    // month est 0-indexé ici (0 = janvier), donc le jour 0 du mois suivant = dernier jour du mois actuel
    return new Date(year, month + 1, 0).getDate();
}

export function computeNextOccurrenceDate(template) {
    const base = template.last_generated_date
        ? new Date(template.last_generated_date)
        : new Date();

    const next = new Date(base);

    switch (template.recurrence_type) {
        case 'daily':
            next.setDate(next.getDate() + template.recurrence_interval);
            break;

        case 'weekly':
            next.setDate(next.getDate() + 7 * template.recurrence_interval);
            break;

        case 'monthly': {
            next.setMonth(next.getMonth() + template.recurrence_interval);
            const lastDay = getLastDayOfMonth(next.getFullYear(), next.getMonth());
            next.setDate(Math.min(template.recurrence_day, lastDay));
            break;
        }

        case 'yearly': {
            next.setFullYear(next.getFullYear() + template.recurrence_interval);
            next.setMonth(template.recurrence_month - 1);
            const lastDay = getLastDayOfMonth(next.getFullYear(), next.getMonth());
            next.setDate(Math.min(template.recurrence_day, lastDay));
            break;
        }
    }

    return next;
}