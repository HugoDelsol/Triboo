// server/src/middlewares/requireAuth.js
export function requireAuth(req, res, next) {
    if (!req.session.householdId) {
        return res.status(401).json({ message: 'Non authentifié' });
    }

    req.householdId = req.session.householdId;
    next();
}