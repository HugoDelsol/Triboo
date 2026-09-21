// src/pages/Notebook.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import FilterSheet from '../components/FilterSheet';
import { SlidersHorizontal } from 'lucide-react';
import FloatingActionButton from '../components/FloatingActionButton';
import CreateSheet from '../components/CreateSheet';
import { useConfirm } from '../context/ConfirmContext';
import { useToast } from '../context/ToastContext';
import { useTaskDetail } from '../context/TaskDetailContext';
import { fetchTasks, updateTaskStatus, deleteTask as apiDeleteTask } from '../api/tasks';
import './Notebook.css';

const PRIORITY_ORDER = { urgent: 0, important: 1, faible: 2 };

export default function Tasks() {
    const navigate = useNavigate();
    const { closeTaskDetail } = useTaskDetail();
    const { showToast } = useToast();
    const { confirm } = useConfirm();
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        type: 'all',       // 'all' | 'task' | 'memo' | 'appointment'
        category: 'all',   // 'all' | nom de catégorie
        status: 'pending', // 'all' | 'pending' | 'done'
        sortBy: 'date',    // 'date' | 'priority'
    });

    useEffect(() => {
        fetchTasks()
            .then(setTasks)
            .catch((err) => {
                setError('Une erreur est survenue, réessaie plus tard.');
            })
            .finally(() => setIsLoading(false));
    }, []);

    const activeFilterCount = Object.entries(filters).filter(
        ([key, value]) => key !== 'sortBy' && value !== 'all'
    ).length;

    const filteredTasks = tasks
        .filter((tasks) => filters.type === 'all' || tasks.type === filters.type)
        .filter((tasks) => filters.category === 'all' || tasks.category_name === filters.category)
        .filter((tasks) => filters.status === 'all' || tasks.status === filters.status)
        .sort((a, b) => {
            if (filters.sortBy === 'priority') {
                return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
            }
            return new Date(a.due_date ?? 0) - new Date(b.due_date ?? 0);
        });

    async function handleToggleTask(taskId, taskTitle, currentStatus) {
        const isDone = currentStatus === 'done';
        const confirmed = await confirm(isDone ? `Réouvrir "${taskTitle}" ?` : `Marquer "${taskTitle}" comme faite ?`);
        if (!confirmed) return;

        const newStatus = isDone ? 'pending' : 'done';

        try {
            await updateTaskStatus(taskId, newStatus);
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );
            closeTaskDetail();
            showToast(isDone ? `"${taskTitle}" réouverte` : `"${taskTitle}" marquée comme faite`, 'success');
        } catch (err) {
            console.error(err);
            showToast('Impossible de mettre à jour la tâche', 'error');
        }
    }

    async function deleteTask(taskId, taskTitle) {
        const confirmed = await confirm(`Supprimer la tâche "${taskTitle}" ?`);
        if (!confirmed) return;

        try {
            await apiDeleteTask(taskId);
            closeTaskDetail();
            setTasks((prev) => prev.filter((task) => task.id !== taskId));
            showToast(`"${taskTitle}" supprimée`, 'success');
        } catch (error) {
            console.error(error);
            showToast('Impossible de supprimer la tâche', 'error');
        }
    }

    async function editTask(taskId) {
        try {
            closeTaskDetail();
            navigate(`/modifier/${taskId}`);
        } catch (error) {
            showToast('Impossible de modifier la tâche', 'error');
        }
    }

    if (isLoading) return <p className="empty-state">Chargement...</p>;
    if (error) return <p className="empty-state">{error}</p>;

    return (
        <div className="content-scroll">
            <div className="phone">
                <div className="tasks-header">
                    <h1 className="tasks-title">Carnet</h1>
                    <button className="filter-button" onClick={() => setFilterOpen(true)}>
                        <SlidersHorizontal size={16} />
                        {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
                    </button>
                </div>

                {filteredTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onToggle={handleToggleTask} onDelete={deleteTask} onEdit={editTask} />
                ))}
                {filteredTasks.length === 0 && (
                    <p className="empty-state">Aucune tâche ne correspond à ces filtres.</p>
                )}
            </div>

            <FloatingActionButton onClick={() => setCreateOpen(true)} />
            {isCreateOpen && <CreateSheet onClose={() => setCreateOpen(false)} />}

            {isFilterOpen && (
                <FilterSheet
                    filters={filters}
                    onChange={setFilters}
                    onClose={() => setFilterOpen(false)}
                />
            )}
        </div>
    );
}