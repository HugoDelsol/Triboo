// src/pages/Notebook.jsx
import { useState } from 'react';
import { mockTasks } from '../data/mockTasks';
import TaskCard from '../components/TaskCard';
import FilterSheet from '../components/FilterSheet';
import { SlidersHorizontal } from 'lucide-react';
import FloatingActionButton from '../components/FloatingActionButton';
import CreateSheet from '../components/CreateSheet';
import './Notebook.css';

const PRIORITY_ORDER = { urgent: 0, important: 1, faible: 2 };

export default function Tasks() {
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        type: 'all',       // 'all' | 'task' | 'memo' | 'appointment'
        category: 'all',   // 'all' | nom de catégorie
        status: 'pending', // 'all' | 'pending' | 'done'
        sortBy: 'date',    // 'date' | 'priority'
    });

    const activeFilterCount = Object.entries(filters).filter(
        ([key, value]) => key !== 'sortBy' && value !== 'all'
    ).length;

    const filteredTasks = mockTasks
        .filter((task) => filters.type === 'all' || task.type === filters.type)
        .filter((task) => filters.category === 'all' || task.category.name === filters.category)
        .filter((task) => filters.status === 'all' || task.status === filters.status)
        .sort((a, b) => {
            if (filters.sortBy === 'priority') {
                return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
            }
            return new Date(a.due_date ?? 0) - new Date(b.due_date ?? 0);
        });

    return (
        <div className="content-scroll">
            <div className="phone">
                <div className="tasks-header">
                    <h1 className="tasks-title">Carnet</h1>
                    <button className="filter-button" onClick={() => setFilterOpen(true)}>
                        <SlidersHorizontal size={16} />
                        {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
                    </button>
                </div>

                {filteredTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}

                {filteredTasks.length === 0 && (
                    <p className="empty-state">Aucune tâche ne correspond à ces filtres.</p>
                )}
            </div>

            <FloatingActionButton onClick={() => setCreateOpen(true)} />
            {isCreateOpen && <CreateSheet onClose={() => setCreateOpen(false)} />}

            {isFilterOpen && (
                <FilterSheet
                    filters={filters}
                    onChange={setFilters}
                    onClose={() => setFilterOpen(false)}
                />
            )}
        </div>
    );
}