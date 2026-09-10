// src/pages/ListsHome.jsx
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import FloatingActionButton from '../components/FloatingActionButton';
import './ListsHome.css'

export default function ListsHome() {
    const navigate = useNavigate();

    return (
        <div className="content-scroll">
            <div className="phone">
                <h1 className="lists-title">Listes</h1>

                {/* {mockLists.map((list) => {
                    const checkedCount = list.items.filter((item) => item.is_checked).length;
                    return (
                        <Link key={list.id} to={`/listes/${list.id}`} className="list-card">
                            <div className="list-card-body">
                                <div className="list-card-title">{list.title}</div>
                                <div className="list-card-meta">
                                    <span className="tag">
                                        <span className="dot" style={{ backgroundColor: list.category.color }} />
                                        {list.category.name}
                                    </span>
                                    <span className="list-progress">{checkedCount}/{list.items.length}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })} */}
            </div>
            <FloatingActionButton onClick={() => navigate('/listes/nouvelle')} />
        </div>
    );
}