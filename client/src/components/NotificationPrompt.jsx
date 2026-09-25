// client/src/components/NotificationPrompt.jsx
import { Bell } from 'lucide-react';
import './NotificationPrompt.css';

export default function NotificationPrompt({ onEnable, onDismiss }) {
    return (
        <>
            <div className="sheet-backdrop" />
            <div className="notification-prompt">
                <div className="notification-prompt-icon">
                    <Bell size={22} />
                </div>
                <h2 className="notification-prompt-title">Active les notifications</h2>
                <p className="notification-prompt-text">
                    Reçois tes rappels de tâches directement sur ton téléphone, même app fermée.
                </p>
                <button className="submit-button" onClick={onEnable}>Activer</button>
                <button className="notification-prompt-later" onClick={onDismiss}>Plus tard</button>
            </div>
        </>
    );
}