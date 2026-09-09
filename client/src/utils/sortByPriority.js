// src/utils/sortByPriority.js
const PRIORITY_ORDER = {
    urgent: 0,
    important: 1,
    faible: 2,
};

export function sortByPriority(tasks) {
    return [...tasks].sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    );
}