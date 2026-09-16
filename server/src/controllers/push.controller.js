// server/src/controllers/push.controller.js
import { insertPushSubscription } from '../repositories/pushSubscription.repository.js';

export async function subscribe(req, res) {
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
        return res.status(400).json({ message: 'Abonnement invalide' });
    }

    try {
        await insertPushSubscription(req.session.profileId, endpoint, keys.p256dh, keys.auth);
        res.status(201).json({ message: 'Abonnement enregistré' });
    } catch (error) {
        console.error('Erreur subscribe:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}