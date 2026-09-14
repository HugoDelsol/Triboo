// src/context/TaskDetailContext.jsx
import { createContext, useContext, useState } from 'react';
import TaskDetailCard from '../components/TaskDetailCard';
import './TaskDetailContext.css';

const TaskDetailContext = createContext(null);

export function TaskDetailProvider({ children }) {
    const [detailState, setDetailState] = useState(null);

    function openTaskDetail(task, handlers) {
        setDetailState({ task, ...handlers });
    }

    function closeTaskDetail() {
        setDetailState(null);
    }

    return (
        <TaskDetailContext.Provider value={{ openTaskDetail, closeTaskDetail }}>
            {children}
            {detailState && (
                <>
                    <div className="sheet-backdrop" onClick={closeTaskDetail} />
                    <div className="task-detail-modal">
                        <TaskDetailCard
                            task={detailState.task}
                            onToggle={detailState.onToggle}
                            onEdit={detailState.onEdit}
                            onDelete={detailState.onDelete}
                        />
                    </div>
                </>
            )}
        </TaskDetailContext.Provider>
    );
}

export function useTaskDetail() {
    return useContext(TaskDetailContext);
}