// src/components/FloatingActionButton.jsx
import { Plus } from 'lucide-react';
import './FloatingActionButton.css';

export default function FloatingActionButton({ onClick }) {
    return (
        <button className="fab" onClick={onClick}>
            <Plus size={22} />
        </button>
    );
}