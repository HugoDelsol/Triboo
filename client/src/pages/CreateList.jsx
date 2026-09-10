// src/pages/CreateList.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';

import './CreateList.css';

export default function CreateList() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const { showToast } = useToast();

    function handleSubmit(e) {
        e.preventDefault();
        const name = title.trim();
        if (!name) {
            showToast('Le nom de la liste ne peut pas être vide', 'error');
            return;
        }

        // Pas encore de backend : on log pour l'instant, la vraie création
        // se fera via un appel API plus tard (POST /lists)
        console.log('Nouvelle liste :', { title: name, categoryName });
        showToast(`Liste "${name}" créée`, 'success');
        navigate('/listes');
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

                    <div className="category-picker">
                        {/* {mockCategories.map((cat) => (
                            <button
                                type="button"
                                key={cat.name}
                                className={`filter-chip${categoryName === cat.name ? ' active' : ''}`}
                                onClick={() => setCategoryName(cat.name)}
                            >
                                <span className="chip-dot" style={{ backgroundColor: cat.color }} />
                                {cat.name}
                            </button>
                        ))} */}
                    </div>

                    <button type="submit" className="submit-button">Créer la liste</button>
                </form>
            </div>
        </div>
    );
}