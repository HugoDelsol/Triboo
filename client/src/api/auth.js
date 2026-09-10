// client/src/api/auth.js
const API_URL = import.meta.env.VITE_API_URL;

export async function signup(name, password) {
    const response = await fetch(`${API_URL}/households/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, password }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la création du foyer');
    }
    return response.json();
}

export async function login(name, password) {
    const response = await fetch(`${API_URL}/households/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, password }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur de connexion');
    }
    return response.json();
}

export async function checkSession() {
    const response = await fetch(`${API_URL}/households/me`, {
        credentials: 'include',
    });
    if (!response.ok) return null;
    return response.json();
}

export async function logout() {
    await fetch(`${API_URL}/households/logout`, {
        method: 'POST',
        credentials: 'include',
    });
}