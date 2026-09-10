// client/src/pages/SelectProfile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchProfiles, createProfile as apiCreateProfile } from '../api/profiles';

export default function SelectProfile() {
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [error, setError] = useState(null);
    const { selectProfile } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfiles()
            .then(setProfiles)
            .catch((err) => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    async function handleSelect(profileId) {
        try {
            
            await selectProfile(profileId);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        if (!newName.trim()) return;

        try {
            const created = await apiCreateProfile(newName.trim());
            setProfiles((prev) => [...prev, created]);
            setNewName('');
        } catch (err) {
            setError(err.message);
        }
    }

    if (isLoading) return null;

    return (
        <div className="select-profile-page">
            <h1>Qui es-tu ?</h1>

            {profiles.length === 0 && <p>Aucun profil pour l'instant, ajoute le tien.</p>}

            <div className="profile-list">
                {profiles.map((profile) => (
                    <button key={profile.id} onClick={() => handleSelect(profile.id)}>
                        {profile.name}
                    </button>
                ))}
            </div>

            <form onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="Ton prénom"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button type="submit">Ajouter un profil</button>
            </form>

            {error && <p className="error">{error}</p>}
        </div>
    );
}