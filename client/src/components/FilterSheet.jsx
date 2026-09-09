// src/components/FilterSheet.jsx
import { X } from 'lucide-react';
import { mockCategories } from '../data/mockCategories';
import './FilterSheet.css';

const TYPE_OPTIONS = [
    { value: 'all', label: 'Tous' },
    { value: 'task', label: 'Tâche' },
    { value: 'memo', label: 'Mémo' },
    { value: 'appointment', label: 'Rendez-vous' },
];

const STATUS_OPTIONS = [
    { value: 'pending', label: 'À faire' },
    { value: 'all', label: 'Toutes' },
    { value: 'done', label: 'Faites' },
];

const SORT_OPTIONS = [
    { value: 'date', label: 'Date' },
    { value: 'priority', label: 'Priorité' },
];

export default function FilterSheet({ filters, onChange, onClose }) {
    function updateFilter(key, value) {
        onChange({ ...filters, [key]: value });
    }

    return (
        <>
            <div className="sheet-backdrop" onClick={onClose} />
            <div className="filter-sheet">
                <div className="sheet-header">
                    <h2>Filtres</h2>
                    <button className="sheet-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <FilterGroup label="Statut">
                    {STATUS_OPTIONS.map((opt) => (
                        <FilterChip
                            key={opt.value}
                            active={filters.status === opt.value}
                            onClick={() => updateFilter('status', opt.value)}
                            label={opt.label}
                        />
                    ))}
                </FilterGroup>

                <FilterGroup label="Type">
                    {TYPE_OPTIONS.map((opt) => (
                        <FilterChip
                            key={opt.value}
                            active={filters.type === opt.value}
                            onClick={() => updateFilter('type', opt.value)}
                            label={opt.label}
                        />
                    ))}
                </FilterGroup>

                <FilterGroup label="Catégorie">
                    <FilterChip
                        active={filters.category === 'all'}
                        onClick={() => updateFilter('category', 'all')}
                        label="Toutes"
                    />
                    {mockCategories.map((cat) => (
                        <FilterChip
                            key={cat.name}
                            active={filters.category === cat.name}
                            onClick={() => updateFilter('category', cat.name)}
                            label={cat.name}
                            dotColor={cat.color}
                        />
                    ))}
                </FilterGroup>

                <FilterGroup label="Trier par">
                    {SORT_OPTIONS.map((opt) => (
                        <FilterChip
                            key={opt.value}
                            active={filters.sortBy === opt.value}
                            onClick={() => updateFilter('sortBy', opt.value)}
                            label={opt.label}
                        />
                    ))}
                </FilterGroup>
            </div>
        </>
    );
}

function FilterGroup({ label, children }) {
    return (
        <div className="filter-group">
            <div className="filter-group-label">{label}</div>
            <div className="filter-chips">{children}</div>
        </div>
    );
}

function FilterChip({ active, onClick, label, dotColor }) {
    return (
        <button className={`filter-chip${active ? ' active' : ''}`} onClick={onClick}>
            {dotColor && <span className="chip-dot" style={{ backgroundColor: dotColor }} />}
            {label}
        </button>
    );
}