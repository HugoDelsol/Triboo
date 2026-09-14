// src/pages/ListDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import {
    fetchListById,
    addListItem,
    toggleListItem,
    deleteListItem as apiDeleteListItem,
} from '../api/lists';
import './ListDetail.css';

export default function ListDetail() {
    const { listId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    const [list, setList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newItemLabel, setNewItemLabel] = useState('');

    useEffect(() => {
        fetchListById(listId)
            .then(setList)
            .catch(() => setError('Liste introuvable.'))
            .finally(() => setIsLoading(false));
    }, [listId]);

    async function handleToggleItem(itemId, isChecked) {
        try {
            await toggleListItem(listId, itemId, !isChecked);
            setList((prev) => ({
                ...prev,
                items: prev.items.map((item) =>
                    item.id === itemId ? { ...item, is_checked: !isChecked } : item
                ),
            }));
        } catch (err) {
            showToast(err.message, 'error');
        }
    }

    async function handleDeleteItem(itemId) {
        const confirmed = await confirm('Supprimer cet élément ?');
        if (!confirmed) return;

        try {
            await apiDeleteListItem(listId, itemId);
            setList((prev) => ({
                ...prev,
                items: prev.items.filter((item) => item.id !== itemId),
            }));
        } catch (err) {
            showToast(err.message, 'error');
        }
    }

    async function handleAddItem(e) {
        e.preventDefault();
        const trimmed = newItemLabel.trim();
        if (!trimmed) {
            showToast("L'élément ne peut pas être vide", 'error');
            return;
        }

        try {
            const created = await addListItem(listId, trimmed);
            setList((prev) => ({ ...prev, items: [...prev.items, created] }));
            setNewItemLabel('');
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

                <h1 className="list-detail-title">{list.title}</h1>

                <div className="list-items">
                    {list.items.map((item) => (
                        <div key={item.id} className="list-item">
                            <button
                                className={`item-check${item.is_checked ? ' checked' : ''}`}
                                onClick={() => handleToggleItem(item.id, item.is_checked)}
                            />
                            <span className={`item-label${item.is_checked ? ' checked' : ''}`}>
                                {item.label}
                            </span>
                            <button className="item-delete" onClick={() => handleDeleteItem(item.id)}>
                                <Trash2 size={15} />
                            </button>
                        </div>
                    ))}
                </div>

                <form className="add-item-form" onSubmit={handleAddItem}>
                    <input
                        type="text"
                        className="add-item-input"
                        placeholder="Ajouter un élément..."
                        value={newItemLabel}
                        onChange={(e) => setNewItemLabel(e.target.value)}
                    />
                </form>
            </div>
        </div>
    );
}