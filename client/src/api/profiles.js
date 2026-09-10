// client/src/api/profiles.js
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchProfiles() {
    const response = await fetch(`${API_URL}/profiles`, {
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Impossible de récupérer les profils');
    return response.json();
}

export async function createProfile(name) {
    const response = await fetch(`${API_URL}/profiles`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Impossible de créer le profil');
    }
    return response.json();
}

export async function selectProfile(profileId) {
    const response = await fetch(`${API_URL}/profiles/select`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Impossible de sélectionner le profil');
    }
    return response.json();
}

export async function deleteProfile(profileId) {
    const response = await fetch(`${API_URL}/profiles/${profileId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Impossible de supprimer le profil');
    }
    return response.json();
}