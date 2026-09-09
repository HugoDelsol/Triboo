// src/utils/groupTasksBySection.js
import { isToday, isPast, differenceInCalendarDays, isSameDay } from 'date-fns';

export function groupTasksBySection(tasks) {
    const sections = {
        enRetard: [],
        aujourdhui: [],
        cetteSemaine: [],
        memos: [],
    };

    const pendingTasks = tasks.filter((task) => task.status === 'pending');

    for (const task of pendingTasks) {
        if (!task.due_date) {
            sections.memos.push(task);
            continue;
        }

        const dueDate = new Date(task.due_date);

        if (isPast(dueDate) && !isToday(dueDate)) {
            sections.enRetard.push(task);
        } else if (isToday(dueDate)) {
            sections.aujourdhui.push(task);
        } else if (differenceInCalendarDays(dueDate, new Date()) <= 7) {
            sections.cetteSemaine.push(task);
        }
    }

    return sections;
}