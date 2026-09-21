// server/src/controllers/household.controller.js
import bcrypt from 'bcrypt';
import { findHouseholdByName, insertHousehold, findHouseholdById } from '../repositories/household.repository.js';
import { findProfileById } from '../repositories/profile.repository.js';

export async function signup(req, res) {
    const { name, password } = req.body;

    if (!name?.trim() || !password?.trim()) {
        return res.status(400).json({ message: 'Nom du foyer et mot de passe requis' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = await insertHousehold(name.trim(), hashedPassword);

        req.session.householdId = id;
        res.status(201).json({ message: 'Foyer créé', householdId: id, householdName: name.trim() });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Ce nom de foyer est déjà pris' });
        }
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function login(req, res) {
    const { name, password } = req.body;

    if (!name?.trim() || !password?.trim()) {
        return res.status(400).json({ message: 'Nom du foyer et mot de passe requis' });
    }

    try {
        const household = await findHouseholdByName(name);
        if (!household) {
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        const isValid = await bcrypt.compare(password, household.password_hash);
        if (!isValid) {
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        req.session.householdId = household.id;
        res.json({ message: 'Connecté', householdId: household.id, householdName: household.name });
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export async function me(req, res) {
    if (!req.session.householdId) {
        return res.status(401).json({ message: 'Non authentifié' });
    }

    try {
        const household = await findHouseholdById(req.session.householdId);
        if (!household) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        let profileName = null;
        if (req.session.profileId) {
            const profile = await findProfileById(req.session.profileId, req.session.householdId);
            profileName = profile?.name ?? null;
        }

        res.json({
            householdId: household.id,
            householdName: household.name,
            profileId: req.session.profileId ?? null,
            profileName,
        });
    } catch (error) {
        res.status(500).json({ message: 'Une erreur est survenue, réessaie plus tard' });
    }
}

export function logout(req, res) {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
        res.clearCookie('triboo_session');
        res.json({ message: 'Déconnecté' });
    });
}