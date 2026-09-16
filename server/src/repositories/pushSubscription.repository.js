// server/src/repositories/pushSubscription.repository.js
import { pool } from '../config/database.js';

export async function insertPushSubscription(profileId, endpoint, p256dh, auth) {
    await pool.query(
        `INSERT INTO push_subscriptions (profile_id, endpoint, keys_p256dh, keys_auth)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE profile_id = VALUES(profile_id), keys_p256dh = VALUES(keys_p256dh), keys_auth = VALUES(keys_auth)`,
        [profileId, endpoint, p256dh, auth]
    );
}

export async function findSubscriptionsByProfileId(profileId) {
    const [rows] = await pool.query(
        `SELECT endpoint, keys_p256dh, keys_auth FROM push_subscriptions WHERE profile_id = ?`,
        [profileId]
    );
    return rows;
}