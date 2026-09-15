// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { fetchTasks, updateTaskStatus } from '../api/tasks';
import { groupTasksBySection } from '../utils/groupTasksBySection';
import { sortByPriority } from '../utils/sortByPriority';
import TaskCard from '../components/TaskCard';
import { formatGreetingDate } from '../utils/formatGreetingDate';
import SummaryPill from '../components/SummaryPill';
import FloatingActionButton from '../components/FloatingActionButton';
import CreateSheet from '../components/CreateSheet';
import EmptyStateCard from '../components/EmptyStateCard';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
    const { householdName, profileName } = useAuth();
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
                setError('Une erreur est survenue, réessaie plus tard.')
            })
            .finally(() => setIsLoading(false));
    }, []);

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

    async function deleteTask(params) {
        try {
            
        } catch (error) {
            
        }
    }

    async function editTask(params) {
        try {
            
        } catch (error) {
            
        }
    }

    const grouped = groupTasksBySection(tasks);

    if (isLoading) return <p className="empty-state">Chargement...</p>;
    if (error) return <p className="empty-state">{error}</p>;

    return (
        <div className="content-scroll">
            <div className="phone">

                <header>
                    <div className="eyebrow">{householdName}</div>
                    <div className="greeting">Bonjour {profileName}</div>
                    <div className="date-line">{formatGreetingDate()}</div>

                    <div className="summary-row">
                        <SummaryPill count={grouped.enRetard.length} label="EN RETARD" variant="late" />
                        <SummaryPill count={grouped.aujourdhui.length} label="AUJOURD'HUI" variant="today" />
                        <SummaryPill count={grouped.cetteSemaine.length} label="CETTE SEMAINE" variant="week" />
                    </div>
                </header>

                <section className="group">
                    <div className="group-title">
                        En retard
                        <div className="divider" />
                    </div>
                    {grouped.enRetard.length === 0 && (
                        <EmptyStateCard message="Rien en retard, bravo !" />
                    )}
                    {sortByPriority(grouped.enRetard).map((task) => (
                        <TaskCard key={task.id} task={task} onToggle={handleToggleTask} onDelete={deleteTask} onEdit={editTask} />
                    ))}
                </section>

                <section className="group">
                    <div className="group-title">
                        Aujourd'hui
                        <div className="divider" />
                    </div>
                    {grouped.aujourdhui.length === 0 && (
                        <EmptyStateCard message="Rien de prévu aujourd'hui." />
                    )}
                    {sortByPriority(grouped.aujourdhui).map((task) => (
                        <TaskCard key={task.id} task={task} onToggle={handleToggleTask} />
                    ))}
                </section>

                <section className="group">
                    <div className="group-title">
                        Cette semaine
                        <div className="divider" />
                    </div>
                    {grouped.cetteSemaine.length === 0 && (
                        <EmptyStateCard message="Rien de prévu cette semaine." />
                    )}
                    {sortByPriority(grouped.cetteSemaine).map((task) => (
                        <TaskCard key={task.id} task={task} onToggle={handleToggleTask} />
                    ))}
                </section>

                <section className="group">
                    <div className="group-title">
                        Mémos
                        <div className="divider" />
                    </div>
                    {grouped.memos.length === 0 && (
                        <EmptyStateCard message="Aucun mémo pour l'instant." />
                    )}
                    {sortByPriority(grouped.memos).map((task) => (
                        <TaskCard key={task.id} task={task} onToggle={handleToggleTask} />
                    ))}
                </section>

            </div>
            <FloatingActionButton onClick={() => setCreateOpen(true)} />
            {isCreateOpen && <CreateSheet onClose={() => setCreateOpen(false)} />}
        </div>
    );
}