// src/components/TaskDetailCard.jsx
import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Paperclip, Users, Clock, MapPin, Settings, CheckCircle, Pencil, Trash2, Calendar } from 'lucide-react';
import './TaskDetailCard.css';

export default function TaskDetailCard({ task, onToggle, onEdit, onDelete }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isDone = task.status === 'done';
    const dueDate = task.due_date ? new Date(task.due_date) : null;
    const dateLabel = dueDate ? format(dueDate, 'EEEE d MMMM', { locale: fr }) : null;
    const shortTime = task.due_time?.split(':').slice(0, 2).join(':');

    return (
        <div className={`detail-card p-${task.priority}${isDone ? ' done' : ''}`}>
            <div className="detail-header">
                <div className="detail-header-text">
                    {task.category_id && (
                        <span className="tag">
                            <span className="dot" style={{ backgroundColor: task.category_color }} />
                            {task.category_name}
                        </span>
                    )}
                    <h2 className="detail-title">{task.title}</h2>
                </div>

                <div className="detail-menu-wrapper">
                    <button className="detail-menu-trigger" onClick={() => setIsMenuOpen((prev) => !prev)}>
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
                                <CheckCircle size={14} /> {isDone ? 'Réouvrir' : 'Terminer'}
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

            {task.description && <p className="detail-description">{task.description}</p>}

            {(dateLabel || shortTime || task.location) && (
                <div className="detail-row">
                    {dateLabel && (
                        <span className="detail-info"><Calendar size={14} /> {dateLabel}</span>
                    )}
                    {shortTime && (
                        <span className="detail-info"><Clock size={14} /> {shortTime}</span>
                    )}
                    {task.location && (
                        <span className="detail-info"><MapPin size={14} /> {task.location}</span>
                    )}
                </div>
            )}

            {task.assignees?.length > 0 && (
                <div className="detail-row">
                    <Users size={14} />
                    {task.assignees.map((a) => a.name).join(', ')}
                </div>
            )}

            {task.attachments?.length > 0 && (
                <div className="detail-attachments">
                    {task.attachments.map((file) => (
                        <div key={file.id} className="attachment-chip">
                            <Paperclip size={13} />
                            {file.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}