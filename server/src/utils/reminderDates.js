// server/src/utils/reminderDates.js
function getParisOffset(date) {
    const parisString = date.toLocaleString('en-US', { timeZone: 'Europe/Paris', hour12: false });
    const utcString = date.toLocaleString('en-US', { timeZone: 'UTC', hour12: false });
    return (new Date(parisString) - new Date(utcString)) / 3600000;
}

export function buildReminderDates(dueDate) {
    const dates = {};

    const naiveDate = new Date(`${dueDate}T08:00:00Z`);
    const offset = getParisOffset(naiveDate);
    const dayOf = new Date(naiveDate.getTime() - offset * 3600000);
    dates.dayOf = dayOf;

    const the24hBefore = new Date(dayOf);
    the24hBefore.setDate(the24hBefore.getDate() - 1);
    dates.the24hBefore = the24hBefore;

    return dates;
}