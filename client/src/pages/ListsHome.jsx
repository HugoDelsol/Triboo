// src/pages/ListsHome.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteList as apiDeleteList } from '../api/lists';
import { fetchLists } from '../api/lists';
import { useConfirm } from '../context/ConfirmContext';
import { useToast } from '../context/ToastContext';
import FloatingActionButton from '../components/FloatingActionButton';
import './ListsHome.css'

export default function ListsHome() {
    const { confirm } = useConfirm();
    const { showToast } = useToast()
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLists()
            .then(setLists)
            .catch((err) => {
                setError('Une erreur est survenue, réessaie plus tard.');
            })
            .finally(() => setIsLoading(false));
    }, []);

    async function handleDeleteItem(listId) {
        const confirmed = await confirm('Supprimer cette liste ?');
        if (!confirmed) return;

        try {
            await apiDeleteList(listId);
            setLists((prev) => prev.filter((list) => list.id !== listId));
            showToast('Liste supprimée', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    }

    if (isLoading) return <p className="empty-state">Chargement...</p>;
    if (error) return <p className="empty-state">{error}</p>;

    return (
        <div className="content-scroll">
            <div className="phone">
                <h1 className="lists-title">Listes</h1>

                {lists.map((list) => {
                    return (
                        <Link key={list.id} to={`/listes/${list.id}`} className="list-card">
                            <div className="list-card-body">
                                <div className="list-card-title">{list.title}
                                    <button className="item-delete" onClick={
                                        (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDeleteItem(list.id);
                                        }}
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                                <div className="list-card-meta">
                                    <span className="tag">
                                        <span className="dot" style={{ backgroundColor: list.category_color }} />
                                        {list.category_name}
                                    </span>

                                    <span className="list-progress">{list.checked_items}/{list.total_items}</span>

                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
            <FloatingActionButton onClick={() => navigate('/listes/nouvelle')} />
        </div>
    );
}