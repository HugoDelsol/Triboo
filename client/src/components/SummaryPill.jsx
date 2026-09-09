// src/components/SummaryPill.jsx
import './SummaryPill.css';


export default function SummaryPill({ count, label, variant }) {
    return (
        <div className="summary-pill">
            <div className={`count ${variant}`}>{count}</div>
            <div className="label">{label}</div>
        </div>
    );
}