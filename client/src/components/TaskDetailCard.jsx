// src/components/TaskDetailCard.jsx
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Paperclip, Users, Clock, MapPin } from 'lucide-react';
import './TaskDetailCard.css';

export default function TaskDetailCard({ task }) {
    return (
        <div className={`detail-card p-${task.priority}`}>
            <div className="detail-header">
               {task.category_id && (
                        <span className="tag">
                            <span className="dot" style={{ backgroundColor: task.category_color }} />
                            {task.category_name}
                        </span>
                    )}
                <h2 className="detail-title">{task.title}</h2>
            </div>

            {task.description && <p className="detail-description">{task.description}</p>}

            {(task.due_time || task.location) && (
                <div className="detail-row">
                    {task.due_time && (
                        <span className="detail-info"><Clock size={14} /> {task.due_time}</span>
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