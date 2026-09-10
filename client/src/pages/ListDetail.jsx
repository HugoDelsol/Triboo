// src/pages/ListDetail.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import './ListDetail.css';

export default function ListDetail() {
    const { listId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const initialList = mockLists.find((list) => list.id === Number(listId));
    const [items, setItems] = useState(initialList?.items ?? []);
    const [newItemLabel, setNewItemLabel] = useState('');

    function toggleItem(itemId) {
        setItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, is_checked: !item.is_checked } : item
            )
        );
    }

    function deleteItem(itemId) {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
    }

    function handleAddItem(e) {
        e.preventDefault();
        const trimmed = newItemLabel.trim();
        if (!trimmed) {
            showToast("L'élément ne peut pas être vide", 'error');
            return;
        }


        setItems((prev) => [
            ...prev,
            { id: Date.now(), label: trimmed, is_checked: false },
        ]);
        setNewItemLabel('');
    }

    if (!initialList) {
        return <p className="empty-state">Liste introuvable.</p>;
    }

    return (
        <div className="content-scroll">
            <div className="phone">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} />
                </button>

                <h1 className="list-detail-title">{initialList.title}</h1>

                <div className="list-items">
                    {items.map((item) => (
                        <div key={item.id} className="list-item">
                            <button
                                className={`item-check${item.is_checked ? ' checked' : ''}`}
                                onClick={() => toggleItem(item.id)}
                            />
                            <span className={`item-label${item.is_checked ? ' checked' : ''}`}>
                                {item.label}
                            </span>
                            <button className="item-delete" onClick={() => deleteItem(item.id)}>
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