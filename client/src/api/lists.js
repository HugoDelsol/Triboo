// client/src/api/lists.js
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchLists() {
    const response = await fetch(`${API_URL}/lists`, {
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Impossible de récupérer les listes');
    }
    return response.json();
}

export async function fetchListById(listId) {
    const response = await fetch(`${API_URL}/lists/${listId}`, {
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Impossible de récupérer la liste');
    }
    return response.json();
}

export async function createList(title, categoryId) {
    const response = await fetch(`${API_URL}/lists`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category_id: categoryId }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Impossible de créer la liste');
    }
    return response.json();
}

export async function deleteList(listId) {
    const response = await fetch(`${API_URL}/lists/${listId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Impossible de supprimer la liste');
    }
    return response.json();
}

export async function addListItem(listId, label) {
    const response = await fetch(`${API_URL}/lists/${listId}/items`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Impossible d'ajouter l'article");
    }
    return response.json();
}

export async function toggleListItem(listId, itemId, isChecked) {
    const response = await fetch(`${API_URL}/lists/${listId}/items/${itemId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_checked: isChecked }),
    });
    if (!response.ok) {
        throw new Error("Impossible de mettre à jour l'article");
    }
    return response.json();
}

export async function deleteListItem(listId, itemId) {
    const response = await fetch(`${API_URL}/lists/${listId}/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error("Impossible de supprimer l'article");
    }
    return response.json();
}