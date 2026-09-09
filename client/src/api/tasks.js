// src/api/tasks.js
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchTasks() {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) {
        throw new Error('Impossible de récupérer les tâches');
    }
    return response.json();
}

export async function updateTaskStatus(taskId, status) {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        throw new Error('Impossible de mettre à jour la tâche');
    }
    return response.json();
}