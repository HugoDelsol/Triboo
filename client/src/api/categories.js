// client/src/api/categories.js
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchCategories() {
    const response = await fetch(`${API_URL}/categories`, {
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Impossible de récupérer les catégories');
    }
    return response.json();
}

export async function createCategory(name, color) {
    const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Impossible de créer la catégorie');
    }
    return response.json();
}

export async function updateCategory(categoryId, name, color) {
    const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Impossible de mettre à jour la catégorie');
    }
    return response.json();
}

export async function deleteCategory(categoryId) {
    const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Impossible de supprimer la catégorie');
    }
    return response.json();
}