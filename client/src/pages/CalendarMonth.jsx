// src/pages/CalendarMonth.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isSameMonth,
    isToday,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockTasks } from '../data/mockTasks';
import './CalendarMonth.css';

export default function CalendarMonth() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const navigate = useNavigate();

    const gridStart = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const gridEnd = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

    function getTasksForDay(day) {
        return mockTasks.filter(
            (task) => task.due_date && isSameMonth(new Date(task.due_date), currentMonth)
                && format(new Date(task.due_date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        );
    }

    return (
        <div className="content-scroll">
            <div className="phone">
                <div className="month-header">
                    <button className="month-nav" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="month-title">{format(currentMonth, 'MMMM yyyy', { locale: fr })}</h1>
                    <button className="month-nav" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="calendar-grid">
                    {days.map((day) => {
                        const dayTasks = getTasksForDay(day);
                        return (
                            <button
                                key={day.toISOString()}
                                className={`calendar-day${!isSameMonth(day, currentMonth) ? ' outside' : ''}${isToday(day) ? ' today' : ''}`}
                                onClick={() => navigate(`/calendrier/${format(day, 'yyyy-MM-dd')}`)}
                            >
                                <span className="day-number">{format(day, 'd')}</span>
                                {dayTasks.length > 0 && <span className="day-dot" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}