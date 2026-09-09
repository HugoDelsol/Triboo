// src/pages/Dashboard.jsx
import { mockTasks } from '../data/mockTasks';
import { groupTasksBySection } from '../utils/groupTasksBySection';
import { sortByPriority } from '../utils/sortByPriority';
import TaskCard from '../components/TaskCard';
import { currentProfile } from '../data/mockProfile';
import { formatGreetingDate } from '../utils/formatGreetingDate';
import SummaryPill from '../components/SummaryPill';
import { useState } from 'react';
import FloatingActionButton from '../components/FloatingActionButton';
import CreateSheet from '../components/CreateSheet';
import './Dashboard.css';

export default function Dashboard() {
    const [isCreateOpen, setCreateOpen] = useState(false);
    const grouped = groupTasksBySection(mockTasks);

    return (
        <div className="content-scroll">
            <div className="phone">

                <header>
                    <div className="eyebrow">Foyer Delsol</div>
                    <div className="greeting">Bonjour {currentProfile.name}</div>
                    <div className="date-line">{formatGreetingDate()}</div>

                    <div className="summary-row">
                        <SummaryPill count={grouped.enRetard.length} label="EN RETARD" variant="late" />
                        <SummaryPill count={grouped.aujourdhui.length} label="AUJOURD'HUI" variant="today" />
                        <SummaryPill count={grouped.cetteSemaine.length} label="CETTE SEMAINE" variant="week" />
                    </div>
                </header>

                <section className="group">
                    <div className="group-title">
                        En retard
                        <div className="divider" />
                    </div>
                    {sortByPriority(grouped.enRetard).map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </section>

                <section className="group">
                    <div className="group-title">
                        Aujourd'hui
                        <div className="divider" />
                    </div>
                    {sortByPriority(grouped.aujourdhui).map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </section>

                <section className="group">
                    <div className="group-title">
                        Cette semaine
                        <div className="divider" />
                    </div>
                    {sortByPriority(grouped.cetteSemaine).map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </section>

                <section className="group">
                    <div className="group-title">
                        Mémos
                        <div className="divider" />
                    </div>
                    {sortByPriority(grouped.memos).map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </section>

            </div>
            <FloatingActionButton onClick={() => setCreateOpen(true)} />
            {isCreateOpen && <CreateSheet onClose={() => setCreateOpen(false)} />}
        </div>
    );
}