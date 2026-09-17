// src/pages/CreateTask.jsx
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { fetchCategories } from '../api/categories';
import { fetchTaskById, updateTask, updateRecurringTask } from '../api/tasks';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';

import './CreateTask.css';

const TYPE_LABELS = {
    task: 'Tâche',
    memo: 'Mémo',
    appointment: 'Rendez-vous',
};

const PRIORITY_OPTIONS = [
    { value: 'urgent', label: 'Urgent' },
    { value: 'important', label: 'Important' },
    { value: 'faible', label: 'Faible' },
];

const RECURRENCE_OPTIONS = [
    { value: 'daily', label: 'Chaque jour' },
    { value: 'weekly', label: 'Chaque semaine' },
    { value: 'monthly', label: 'Chaque mois' },
    { value: 'yearly', label: 'Chaque année' },
];

export default function CreateTask() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const prefilledDate = searchParams.get('date') ?? '';
    const { showToast } = useToast();
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dataTask, setDataTask] = useState({});
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [priority, setPriority] = useState('important');
    const [dueDate, setDueDate] = useState(prefilledDate);
    const [dueTime, setDueTime] = useState('');
    const [location, setLocation] = useState('');
    const [isShared, setIsShared] = useState(true);
    const [wantsReminder, setWantsReminder] = useState(true);
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceType, setRecurrenceType] = useState('monthly');

    const [recurrenceInterval, setRecurrenceInterval] = useState(1);

    useEffect(() => {
        fetchCategories()
            .then(setCategories)
            .catch(() => setError('Une erreur est survenue, réessaie plus tard.'))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchTaskById(taskId)
            .then((data) => {
                setDataTask(data),
                    setIsRecurring(!!data.recurrence_interval)
            })
            .catch(() => setError('Une erreur est survenue, réessaie plus tard.'))
            .finally(() => setIsLoading(false));
    }, []);

    console.log("testttttt", dataTask)


    async function handleSubmit(e) {
        e.preventDefault();
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            showToast('Le titre ne peut pas être vide', 'error');
            return;
        }

        if ((dataTask.type === "task" || dataTask.type === "appointment") && !dueDate) {
            showToast('Une date est requise pour ce type', 'error');
            return;
        }

        try {
            if (isRecurring) {
                const [month, day] = dueDate.split('-').map(Number);

                await updateRecurringTask({
                    id: dataTask.id,
                    title: trimmedTitle,
                    description: description.trim() || null,
                    category_id: selectedCategoryId,
                    due_date: dueDate,
                    recurrence_type: recurrenceType,
                    recurrence_interval: recurrenceInterval,
                    recurrence_day: day,
                    recurrence_month: recurrenceType === 'yearly' ? month : null,
                    is_shared: isShared,
                    wants_reminder: wantsReminder,
                });
            } else {
                await updateTask({
                    id: dataTask.id,
                    type,
                    title: trimmedTitle,
                    description: description.trim() || null,
                    category_id: selectedCategoryId,
                    due_date: dueDate || null,
                    due_time: "",
                    location: "",
                    priority,
                    is_shared: isShared,
                    wants_reminder: wantsReminder,
                });
            }

            showToast(`${TYPE_LABELS[dataTask.type]} modifié${type === 'task' ? 'e' : ''}`, 'success');
            navigate('/');
        } catch (err) {
            showToast("Une erreur est survenue", 'error');
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

                <h1 className="create-task-title">Modifier la tache</h1>

                <form onSubmit={handleSubmit} className="create-task-form">
                    <input
                        type="text"
                        className="add-item-input"
                        placeholder="Titre"
                        value={dataTask.title}
                        onChange={(e) => setDataTask(prev => ({ ...prev, title: e.target.value }))}
                        autoFocus
                    />

                    <textarea
                        className="add-item-input"
                        placeholder="Description (optionnel)"
                        value={dataTask.description}
                        onChange={(e) => setDataTask(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                    />

                    {dataTask.due_date && (
                        <input
                            type="date"
                            className="add-item-input"
                            value={dataTask.due_date?.slice(0, 10)}
                            onChange={(e) => setDataTask(prev => ({ ...prev, due_date: e.target.value }))}
                        />
                    )}

                    {dataTask.type === 'appointment' && (
                        <>
                            <input
                                type="time"
                                className="add-item-input"
                                value={dataTask.due_time}
                                onChange={(e) => setDataTask(prev => ({ ...prev, due_time: e.target.value }))}
                            />
                            <input
                                type="text"
                                className="add-item-input"
                                placeholder="Lieu (optionnel)"
                                value={dataTask.location}
                                onChange={(e) => setDataTask(prev => ({ ...prev, location: e.target.value }))}
                            />
                        </>
                    )}

                    <div className="field-label">Priorité</div>
                    <div className="chip-row">
                        {PRIORITY_OPTIONS.map((opt) => (
                            <button
                                type="button"
                                key={opt.value}
                                className={`filter-chip${dataTask.priority === opt.value ? ' active' : ''}`}
                                onClick={() => setDataTask(prev => ({ ...prev, priority: opt.value }))}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div className="field-label">Catégorie</div>
                    <div className="chip-row">
                        {categories.map((cat) => (
                            <button
                                type="button"
                                key={cat.id}
                                className={`filter-chip${dataTask.category_id === cat.id ? ' active' : ''}`}
                                onClick={() => setDataTask(prev => ({ ...prev, category_id: prev.category_id === cat.id ? null : cat.id }))}
                            >
                                <span className="chip-dot" style={{ backgroundColor: cat.color }} />
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="checkboxDiv">
                        <label className="checkbox-field">
                            <input
                                type="checkbox"
                                checked={!dataTask.is_shared}
                                onChange={(e) => setDataTask(prev => ({ ...prev, is_shared: !e.target.checked }))}
                            />
                            Garder pour moi
                        </label>

                        {(dataTask.type === 'task' || dataTask.type === 'appointment') && (
                            <label className="checkbox-field">
                                <input
                                    type="checkbox"
                                    checked={!dataTask.wants_reminder}
                                    onChange={(e) => setDataTask(prev => ({ ...prev, wants_reminder: !e.target.checked }))}
                                />
                                Ne pas me rappeler
                            </label>
                        )}

                        {(dataTask.type === 'task' || dataTask.type === 'appointment') && (
                            <>
                                <label className="checkbox-field">
                                    <input
                                        type="checkbox"
                                        checked={isRecurring}
                                        onChange={(e) => setIsRecurring(e.target.checked)}
                                    />
                                    Rendre récurrente
                                </label>

                                {isRecurring && (
                                    <div className="recurrence-fields">
                                        <div className="field-label">Fréquence</div>
                                        <div className="chip-row">
                                            {RECURRENCE_OPTIONS.map((opt) => (
                                                <button
                                                    type="button"
                                                    key={opt.value}
                                                    className={`filter-chip${dataTask.recurrence_type === opt.value ? ' active' : ''}`}
                                                    onClick={() => setDataTask(prev => ({ ...prev, recurrence_type: opt.value }))}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <button type="submit" className="submit-button">Créer</button>
                </form>
            </div>
        </div>
    );
}