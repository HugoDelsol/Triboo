// src/api/tasks.js
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchTasks() {
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error('Impossible de récupérer les tâches');
    }
    return response.json();
}

export async function fetchTaskById(taskId) {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error('Impossible de récupérer les tâches');
    }
    return response.json();
}

export async function createTask(taskData) {
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    });
    if (!response.ok) {
        throw new Error('Impossible de créer la tâche');
    }
    return response.json();
}

export async function createRecurringTask(taskData) {
    const response = await fetch(`${API_URL}/tasks/recurring`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    });
    console.log("testtttt")
    if (!response.ok) {
        throw new Error('Impossible de créer la tâche');
    }
    return response.json();
}

export async function updateTask(data) {
    const response = await fetch(`${API_URL}/tasks/${data.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
    });
    if (!response.ok) {
        throw new Error('Impossible de mettre à jour la tâche');
    }
    return response.json();
}

export async function updateRecurringTask(data) {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
    });
    if (!response.ok) {
        throw new Error('Impossible de mettre à jour la tâche');
    }
    return response.json();
}

export async function updateTaskStatus(taskId, status) {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        throw new Error('Impossible de mettre à jour la tâche');
    }
    return response.json();
}

export async function deleteTask(taskId) {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Impossible de supprimer la tâche');
    }
    return response.json();
}