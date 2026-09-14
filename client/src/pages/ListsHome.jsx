// src/pages/ListsHome.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchLists } from '../api/lists';
import FloatingActionButton from '../components/FloatingActionButton';
import './ListsHome.css'

export default function ListsHome() {
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

    return (
        <div className="content-scroll">
            <div className="phone">
                <h1 className="lists-title">Listes</h1>

                {lists.map((list) => {
                    return (
                        <Link key={list.id} to={`/listes/${list.id}`} className="list-card">
                            <div className="list-card-body">
                                <div className="list-card-title">{list.title}</div>
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