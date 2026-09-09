// TaskCard.jsx
import { differenceInCalendarDays, isPast, isToday, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './TaskCard.css';

export default function TaskCard({ task, onToggle }) {
    const dueDate = task.due_date ? new Date(task.due_date) : null;
    const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate);
    const daysLate = isOverdue ? differenceInCalendarDays(new Date(), dueDate) : null;

    const dateLabel = dueDate
        ? `${format(dueDate, 'EEE d MMM', { locale: fr })}${task.due_time ? ` · ${task.due_time}` : ''}`
        : null;

    return (
        <div className={`card p-${task.priority}`}>
            <div className="body">
                <div className="title">{task.title}</div>
                <div className="meta">
                    <span className="tag">
                        <span className="dot" style={{ backgroundColor: task.category_color }} />
                        {task.category_name}
                    </span>
                    {isOverdue && <span className="overdue-tag">Retard {daysLate} j</span>}
                    {!isOverdue && dateLabel && <span className="time-tag">{dateLabel}</span>}
                </div>
            </div>
            <button className="check" onClick={() => onToggle(task.id, task.title)} />
        </div>
    );
}