// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, updateTaskStatus, deleteTask as apiDeleteTask } from '../api/tasks';
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
import { useTaskDetail } from '../context/TaskDetailContext';
import { saveSubscription } from '../api/push';
import { urlBase64ToUint8Array } from '../utils/urlBase64ToUint8Array';
import './Dashboard.css';
import NotificationPrompt from '../components/NotificationPrompt';

export default function Dashboard() {
    const [showNotifPrompt, setShowNotifPrompt] = useState(false)
    const navigate = useNavigate();
    const { closeTaskDetail } = useTaskDetail();
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

const DISMISS_DAYS = 7;

useEffect(() => {
    if (Notification.permission === 'granted') return;

    const dismissedUntil = localStorage.getItem('notifDate');
    if (!dismissedUntil || new Date() > new Date(dismissedUntil)) {
        setShowNotifPrompt(true);
    }
}, []);

async function handleEnableNotifications() {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            setShowNotifPrompt(false);
            showToast('Notifications refusées', 'error');
            return;
        }

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
        });

        await saveSubscription(subscription);
        setShowNotifPrompt(false);
        showToast('Notifications activées', 'success');
    } catch (err) {
        setShowNotifPrompt(false);
        showToast("Impossible d'activer les notifications", 'error');
    }
}

function handleDismissNotifPrompt() {
    const nextPromptDate = new Date();
    nextPromptDate.setDate(nextPromptDate.getDate() + DISMISS_DAYS);
    localStorage.setItem('notifDate', nextPromptDate);
    setShowNotifPrompt(false);
}

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

    const grouped = groupTasksBySection(tasks);

    if (isLoading) return <p className="empty-state">Chargement...</p>;
    if (error) return <p className="empty-state">{error}</p>;

    return (
        <div className="content-scroll">

            {showNotifPrompt && (
                <NotificationPrompt
                    onEnable={handleEnableNotifications}
                    onDismiss={handleDismissNotifPrompt}
                />
            )}
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
                        <TaskCard key={task.id} task={task} onToggle={handleToggleTask} onDelete={deleteTask} onEdit={editTask} />
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
                        <TaskCard key={task.id} task={task} onToggle={handleToggleTask} onDelete={deleteTask} onEdit={editTask} />
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
                        <TaskCard key={task.id} task={task} onToggle={handleToggleTask} onDelete={deleteTask} onEdit={editTask} />
                    ))}
                </section>

            </div>
            <FloatingActionButton onClick={() => setCreateOpen(true)} />
            {isCreateOpen && <CreateSheet onClose={() => setCreateOpen(false)} />}
        </div>
    );
}