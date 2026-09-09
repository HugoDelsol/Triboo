// src/pages/CreateTask.jsx
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { mockCategories } from '../data/mockCategories';
import { useToast } from '../context/ToastContext';
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

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [priority, setPriority] = useState('important');
    const [dueDate, setDueDate] = useState(prefilledDate);
    const [dueTime, setDueTime] = useState('');
    const [location, setLocation] = useState('');

    const isDateRequired = type === 'task' || type === 'appointment';

    function handleSubmit(e) {
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
            id: Date.now(),
            type,
            title: trimmedTitle,
            description: description.trim() || null,
            category: mockCategories.find((c) => c.name === categoryName) ?? null,
            due_date: dueDate || null,
            due_time: type === 'appointment' ? dueTime || null : null,
            location: type === 'appointment' ? location.trim() || null : null,
            priority,
            status: 'pending',
        };

        // Pas encore de backend : la vraie création se fera via POST /tasks
        console.log('Nouvelle tâche :', newTask);
        showToast(`${TYPE_LABELS[type]} créé${type === 'task' ? 'e' : ''}`, 'success');
        navigate('/');
    }

    return (
        <div className="content-scroll">
            <div className="phone">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} />
                </button>

                <h1 className="create-task-title">Nouveau {TYPE_LABELS[type]?.toLowerCase()}</h1>

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
                        {mockCategories.map((cat) => (
                            <button
                                type="button"
                                key={cat.name}
                                className={`filter-chip${categoryName === cat.name ? ' active' : ''}`}
                                onClick={() => setCategoryName(categoryName === cat.name ? '' : cat.name)}
                            >
                                <span className="chip-dot" style={{ backgroundColor: cat.color }} />
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <button type="submit" className="submit-button">Créer</button>
                </form>
            </div>
        </div>
    );
}