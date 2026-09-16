// TaskCard.jsx
import { useState, useEffect, useRef } from 'react';
import { differenceInCalendarDays, isPast, isToday, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Settings, Check, Pencil, Trash2, Repeat } from 'lucide-react';
import { useTaskDetail } from '../context/TaskDetailContext';
import './TaskCard.css';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isDone = task.status === 'done';
    const { openTaskDetail } = useTaskDetail();
    const dueDate = task.due_date ? new Date(task.due_date) : null;
    const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate);
    const daysLate = isOverdue ? differenceInCalendarDays(new Date(), dueDate) : null;
    const shortTime = task.due_time?.split(':').slice(0, 2).join(':');
    const menuRef = useRef(null);

    useEffect(() => {
        if (!isMenuOpen) return;

        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMenuOpen]);

    const dateLabel = dueDate
        ? `${format(dueDate, 'EEE d MMM', { locale: fr })}${shortTime ? ` · ${shortTime}` : ''}`
        : null;

    return (
        <div className={`card p-${task.priority}${isDone ? ' done' : ''}`}
            onClick={() => {
                if (isMenuOpen) return;
                openTaskDetail(task, { onToggle, onEdit, onDelete });
            }}
        >
            <div className="body" >
                <div className="title">{task.title}</div>
                <div className="meta">
                    {task.category_id && (
                        <span className="tag">
                            <span className="dot" style={{ backgroundColor: task.category_color }} />
                            {task.category_name}
                        </span>
                    )}
                    {isOverdue && <span className="overdue-tag">Retard {daysLate} j</span>}
                    {!isOverdue && dateLabel && <span className="time-tag">{dateLabel}</span>}
                    {task.recurrence_type && (
                        <span className="detail-info">
                            <Repeat size={14} /> 
                        </span>
                    )}
                </div>
            </div>

            <div className="card-menu-wrapper" ref={menuRef}>
                <button
                    className="card-menu-trigger"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen((prev) => !prev);
                    }}
                >
                    <Settings size={16} />
                </button>

                {isMenuOpen && (
                    <div className="card-menu">
                        <button
                            className="card-menu-item"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(false);
                                onToggle(task.id, task.title);
                            }}
                        >
                            <Check size={14} /> {isDone ? 'Réouvrir' : 'Terminer'}
                        </button>
                        <button
                            className="card-menu-item"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(false);
                                onEdit(task.id);
                            }}
                        >
                            <Pencil size={14} /> Modifier
                        </button>
                        <button
                            className="card-menu-item danger"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(false);
                                onDelete(task.id, task.title);
                            }}
                        >
                            <Trash2 size={14} /> Supprimer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}