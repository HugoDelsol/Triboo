// src/pages/CreateList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { createList as apiCreateList } from '../api/lists';
import { fetchCategories } from '../api/categories';

import './CreateList.css';

export default function CreateList() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        fetchCategories()
            .then(setCategories)
            .catch(() => showToast('Impossible de charger les catégories', 'error'))
            .finally(() => setIsLoading(false));
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            showToast('Le nom de la liste ne peut pas être vide', 'error');
            return;
        }
        try {
            await apiCreateList(trimmedTitle, selectedCategoryId);
            showToast(`Liste "${trimmedTitle}" créée`, 'success');
            navigate('/listes');
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    return (
        <div className="content-scroll">
            <div className="phone">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} />
                </button>

                <h1 className="create-list-title">Nouvelle liste</h1>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="add-item-input"
                        placeholder="Nom de la liste"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />

                    {!isLoading && (
                        <div className="category-picker">
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
                    )}

                    <button type="submit" className="submit-button">Créer la liste</button>
                </form>
            </div>
        </div>
    );
}