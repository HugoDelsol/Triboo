// src/components/CreateSheet.jsx
import { useNavigate } from 'react-router-dom';
import { CheckSquare, StickyNote, CalendarClock } from 'lucide-react';
import './CreateSheet.css';

const CREATE_OPTIONS = [
    { type: 'task', label: 'Tâche', Icon: CheckSquare },
    { type: 'memo', label: 'Mémo', Icon: StickyNote },
    { type: 'appointment', label: 'Rendez-vous', Icon: CalendarClock },
];

export default function CreateSheet({ onClose, prefillDate }) {
    const navigate = useNavigate();

    function handleSelect(type) {
        onClose();
        const query = prefillDate ? `?date=${prefillDate}` : '';
        navigate(`/creer/${type}${query}`);
    }

    return (
        <>
            <div className="sheet-backdrop" onClick={onClose} />
            <div className="create-sheet">
                {CREATE_OPTIONS.map(({ type, label, Icon }) => (
                    <button key={type} className="create-option" onClick={() => handleSelect(type)}>
                        <Icon size={18} />
                        {label}
                    </button>
                ))}
            </div>
        </>
    );
}