// src/pages/CalendarDay.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';
import { fetchTasks, updateTaskStatus } from '../api/tasks';
import TaskDetailCard from '../components/TaskDetailCard';
import { useState, useEffect } from 'react';
import { useConfirm } from '../context/ConfirmContext';
import FloatingActionButton from '../components/FloatingActionButton';
import CreateSheet from '../components/CreateSheet';
import EmptyStateCard from '../components/EmptyStateCard';
import { useToast } from '../context/ToastContext';
import './CalendarDay.css';

export default function CalendarDay() {
    const { date } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { confirm } = useConfirm();
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTasks()
            .then(setTasks)
            .catch((err) => {
                setError('Une erreur est survenue, réessaie plus tard.');
            })
            .finally(() => setIsLoading(false));
    }, []);

    const targetDate = parseISO(date);
    const dayTasks = tasks.filter(
        (task) => task.due_date && format(new Date(task.due_date), 'yyyy-MM-dd') === date
    );


    async function handleToggleTask(taskId, taskTitle) {
        const confirmed = await confirm(`Marquer "${taskTitle}" comme faite ?`);
        if (!confirmed) return;

        try {
            await updateTaskStatus(taskId, 'done');
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId ? { ...task, status: 'done' } : task
                )
            );
            showToast(`"${taskTitle}" marquée comme faite`, 'success');
        } catch (err) {
            console.error(err);
            showToast('Impossible de mettre à jour la tâche', 'error');
        }
    }
    if (isLoading) return <p className="empty-state">Chargement...</p>;
    if (error) return <p className="empty-state">{error}</p>;

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
                    <EmptyStateCard message="Rien de prévu ce jour-là." />
                )}

                {dayTasks.map((task) => (
                    <TaskDetailCard key={task.id} task={task} onToggle={handleToggleTask} />
                ))}
            </div>
            <FloatingActionButton onClick={() => setCreateOpen(true)} />
            {isCreateOpen && (
                <CreateSheet onClose={() => setCreateOpen(false)} prefillDate={date} />
            )}
        </div>
    );
}