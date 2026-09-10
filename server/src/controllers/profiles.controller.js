// server/src/controllers/profiles.controller.js
import { findProfilesByHousehold, findProfileById, insertProfile } from '../repositories/profile.repository.js';

export async function getProfiles(req, res) {
    try {
        const profiles = await findProfilesByHousehold(req.session.householdId);
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function createProfile(req, res) {
    const { name } = req.body;
    if (!name?.trim()) {
        return res.status(400).json({ message: 'Le prénom est requis' });
    }

    try {
        const id = await insertProfile(req.session.householdId, name.trim());
        res.status(201).json({ id, name: name.trim() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function selectProfile(req, res) {
    const { profileId } = req.body;

    try {
        const profile = await findProfileById(profileId, req.session.householdId);
        if (!profile) {
            return res.status(404).json({ message: 'Profil introuvable' });
        }

        req.session.profileId = profile.id;
        res.json({ profileId: profile.id, profileName: profile.name });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}