// src/pages/CalendarDay.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';
import { mockTasks } from '../data/mockTasks';
import TaskDetailCard from '../components/TaskDetailCard';
import './CalendarDay.css';

export default function CalendarDay() {
    const { date } = useParams();
    const navigate = useNavigate();

    const targetDate = parseISO(date);

    const dayTasks = mockTasks.filter(
        (task) => task.due_date === date
    );

    return (
        <div className="content-scroll">
            <div className="phone">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} />
                </button>

                <h1 className="day-title">
                    {format(targetDate, 'EEEE d MMMM', { locale: fr })}
                </h1>

                {dayTasks.length === 0 && (
                    <p className="empty-state">Rien de prévu ce jour-là.</p>
                )}

                {dayTasks.map((task) => (
                    <TaskDetailCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
}