// client/src/api/push.js
const API_URL = import.meta.env.VITE_API_URL;

export async function saveSubscription(subscription) {
    const response = await fetch(`${API_URL}/push/subscribe`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
    });
    if (!response.ok) {
        throw new Error("Impossible d'activer les notifications");
    }
    return response.json();
}