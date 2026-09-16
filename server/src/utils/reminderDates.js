// server/src/utils/reminderDates.js
export function buildReminderDates(dueDate, dueTime) {
    const dates = {};

    // Jour J, à 8h fixe (indépendant de due_time, qui reste l'heure du rendez-vous lui-même)
    const dayOf = new Date(`${dueDate}T08:00:00`);
    dates.dayOf = dayOf;

    // 24h avant, également à 8h
    const the24hBefore = new Date(dayOf);
    the24hBefore.setDate(the24hBefore.getDate() - 1);
    dates.the24hBefore = the24hBefore;

    return dates;
}