// src/pages/Settings.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, LogOut } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import {
    fetchCategories,
    createCategory as apiCreateCategory,
    deleteCategory as apiDeleteCategory,
} from '../api/categories';
import {
    fetchProfiles,
    createProfile as apiCreateProfile,
    deleteProfile as apiDeleteProfile,
} from '../api/profiles';

import './Settings.css';

export default function Settings() {
    const { confirm } = useConfirm();
    const { showToast } = useToast();
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newProfileName, setNewProfileName] = useState('');

    useEffect(() => {
        fetchCategories()
            .then(setCategories)
            .catch(() => showToast('Impossible de charger les catégories', 'error'))
            .finally(() => setIsLoadingCategories(false));
    }, []);

    const [profiles, setProfiles] = useState([]);
    const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);

    useEffect(() => {
        fetchProfiles()
            .then(setProfiles)
            .catch(() => showToast('Impossible de charger les profils', 'error'))
            .finally(() => setIsLoadingProfiles(false));
    }, []);

    const { logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        const confirmed = await confirm('Te déconnecter ?');
        if (!confirmed) return;

        try {
            await logout();
            navigate('/login');
        } catch (err) {
            showToast('Impossible de se déconnecter', 'error');
        }
    }

    async function deleteCategory(id, name) {
        const confirmed = await confirm(`Supprimer la catégorie "${name}" ?`);
        if (!confirmed) return;

        try {
            await apiDeleteCategory(id);
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
            showToast(`Catégorie "${name}" supprimée`, 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    }

    async function deleteProfile(id) {
        const profile = profiles.find((p) => p.id === id);
        const confirmed = await confirm(`Supprimer le profil "${profile?.name}" ?`);
        if (!confirmed) return;

        try {
            await apiDeleteProfile(id);
            setProfiles((prev) => prev.filter((p) => p.id !== id));
            showToast(`Profil "${profile?.name}" supprimé`, 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    }

    async function handleAddCategory(e) {
        e.preventDefault();
        const trimmed = newCategoryName.trim();

        if (!trimmed) {
            showToast('Le nom de la catégorie ne peut pas être vide', 'error');
            return;
        }

        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

        try {
            const created = await apiCreateCategory(trimmed, randomColor);
            setCategories((prev) => [...prev, created]);
            setNewCategoryName('');
            showToast(`Catégorie "${trimmed}" ajoutée`, 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    }

    async function handleAddProfile(e) {
        e.preventDefault();
        const trimmed = newProfileName.trim();

        if (!trimmed) {
            showToast('Le nom du profil ne peut pas être vide', 'error');
            return;
        }

        const existingProfile = profiles.find((n) => n.name === trimmed);

        if (existingProfile) {
            showToast(`Le profil "${existingProfile.name}" existe déjà`, 'error');
            return;
        }

        try {
            const created = await apiCreateProfile(trimmed);
            setProfiles((prev) => [...prev, created]);
            setNewProfileName('');
            showToast(`Profil "${trimmed}" ajouté`, 'success');
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    return (
        <div className="content-scroll">
            <div className="phone">
                <h1 className="settings-title">Réglages</h1>

                <section className="settings-section">
                    <h2 className="settings-section-title">Catégories</h2>

                    {isLoadingCategories ? (
                        <p className="settings-loading">Chargement...</p>
                    ) : (
                        <div className="settings-list">
                            {categories.map((cat) => (
                                <div key={cat.id} className="settings-row">
                                    <span className="tag">
                                        <span className="dot" style={{ backgroundColor: cat.color }} />
                                        {cat.name}
                                    </span>
                                    <button className="settings-delete" onClick={() => deleteCategory(cat.id, cat.name)}>
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <form className="settings-add-form" onSubmit={handleAddCategory}>
                        <input
                            type="text"
                            className="add-item-input"
                            placeholder="Nouvelle catégorie"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <button type="submit" className="settings-add-button">
                            <Plus size={18} />
                        </button>
                    </form>
                </section>

                <section className="settings-section">
                    <h2 className="settings-section-title">Profils du foyer</h2>

                    {isLoadingProfiles ? (
                        <p className="settings-loading">Chargement...</p>
                    ) : (
                        <div className="settings-list">
                            {profiles.map((profile) => (
                                <div key={profile.id} className="settings-row">
                                    <span className="settings-profile-name">{profile.name}</span>
                                    <button className="settings-delete" onClick={() => deleteProfile(profile.id)}>
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <form className="settings-add-form" onSubmit={handleAddProfile}>
                        <input
                            type="text"
                            className="add-item-input"
                            placeholder="Nouveau profil"
                            value={newProfileName}
                            onChange={(e) => setNewProfileName(e.target.value)}
                        />
                        <button type="submit" className="settings-add-button">
                            <Plus size={18} />
                        </button>
                    </form>
                </section>

                <section className="settings-section">
                    <button type="button" className="settings-logout" onClick={handleLogout}>
                        <LogOut size={18} />
                        Se déconnecter
                    </button>
                </section>
            </div>
        </div>
    );
}