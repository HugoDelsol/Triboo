// src/components/EmptyStateCard.jsx
import './EmptyStateCard.css';

export default function EmptyStateCard({ message }) {
    return (
        <div className="empty-card">
            <p>{message}</p>
        </div>
    );
}