// server/src/utils/sendPush.js
import webPush from '../config/webPush.js';

export async function sendPushNotification(subscription, payload) {
    try {
        await webPush.sendNotification(subscription, JSON.stringify(payload));
        return true;
    } catch (error) {
        console.error('Erreur envoi push:', error);
        return false;
    }
}