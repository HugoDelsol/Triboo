// server/src/config/webPush.js
import webPush from 'web-push';

webPush.setVapidDetails(
    'mailto:hugo.delsol64@gmail.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

export default webPush;