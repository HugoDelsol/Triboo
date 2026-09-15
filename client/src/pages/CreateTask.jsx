// src/pages/CreateTask.jsx
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { fetchCategories } from '../api/categories';
import { createTask as apiCreateTask } from '../api/tasks';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

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

export default function CreateTask() {
    const { type } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const prefilledDate = searchParams.get('date') ?? '';
    const { showToast } = useToast();
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [priority, setPriority] = useState('important');
    const [dueDate, setDueDate] = useState(prefilledDate);
    const [dueTime, setDueTime] = useState('');
    const [location, setLocation] = useState('');
    const [isShared, setIsShared] = useState(true);
    const [wantsReminder, setWantsReminder] = useState(true);

    const isDateRequired = type === 'task' || type === 'appointment';

    useEffect(() => {
        fetchCategories()
            .then(setCategories)
            .catch((err) => {
                setError('Une erreur est survenue, réessaie plus tard.')
            })
            .finally(() => setIsLoading(false));
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            showToast('Le titre ne peut pas être vide', 'error');
            return;
        }

        if (isDateRequired && !dueDate) {
            showToast('Une date est requise pour ce type', 'error');
            return;
        }

        const newTask = {
            type,
            title: trimmedTitle,
            description: description.trim() || null,
            category_id: selectedCategoryId ?? null,
            due_date: dueDate || null,
            due_time: type === 'appointment' ? dueTime || null : null,
            location: type === 'appointment' ? location.trim() || null : null,
            priority,
            status: 'pending',
            is_shared: isShared,
            wants_reminder: wantsReminder,
        };

        try {
            await apiCreateTask(newTask);
            showToast(`Tâche "${newTask.title}" ajoutée`, 'success');
            navigate('/');
        } catch (err) {
            showToast(err.message, 'error');
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

                <h1 className="create-task-title">{TYPE_LABELS[type] === "Tâche" ? "Nouvelle" : "Nouveau"} {TYPE_LABELS[type]?.toLowerCase()}</h1>

                <form onSubmit={handleSubmit} className="create-task-form">
                    <input
                        type="text"
                        className="add-item-input"
                        placeholder="Titre"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />

                    <textarea
                        className="add-item-input"
                        placeholder="Description (optionnel)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                    />

                    {isDateRequired && (
                        <input
                            type="date"
                            className="add-item-input"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    )}

                    {type === 'appointment' && (
                        <>
                            <input
                                type="time"
                                className="add-item-input"
                                value={dueTime}
                                onChange={(e) => setDueTime(e.target.value)}
                            />
                            <input
                                type="text"
                                className="add-item-input"
                                placeholder="Lieu (optionnel)"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </>
                    )}

                    <div className="field-label">Priorité</div>
                    <div className="chip-row">
                        {PRIORITY_OPTIONS.map((opt) => (
                            <button
                                type="button"
                                key={opt.value}
                                className={`filter-chip${priority === opt.value ? ' active' : ''}`}
                                onClick={() => setPriority(opt.value)}
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
                                className={`filter-chip${selectedCategoryId === cat.id ? ' active' : ''}`}
                                onClick={() => setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id)}
                            >
                                <span className="chip-dot" style={{ backgroundColor: cat.color }} />
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className='checkboxDiv'>
                        <label className="checkbox-field">
                            <input
                                type="checkbox"
                                checked={!isShared}
                                onChange={(e) => setIsShared(!e.target.checked)}
                            />
                            Garder pour moi
                        </label>

                        {isDateRequired && (
                            <label className="checkbox-field">
                                <input
                                    type="checkbox"
                                    checked={!wantsReminder}
                                    onChange={(e) => setWantsReminder(!e.target.checked)}
                                />
                                Ne pas me rappeler
                            </label>
                        )}
                    </div>


                    <button type="submit" className="submit-button">Créer</button>
                </form>
            </div>
        </div>
    );
}