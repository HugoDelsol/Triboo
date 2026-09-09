// src/pages/Settings.jsx
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { mockCategories as initialCategories } from '../data/mockCategories';
import { mockProfiles as initialProfiles } from '../data/mockProfiles';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';

import './Settings.css';

export default function Settings() {
    const { confirm } = useConfirm();
    const { showToast } = useToast();
    const [categories, setCategories] = useState(initialCategories);
    const [profiles, setProfiles] = useState(initialProfiles);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newProfileName, setNewProfileName] = useState('');

    async function deleteCategory(name) {
        const confirmed = await confirm(`Supprimer la catégorie "${name}" ?`);
        if (!confirmed) return;

        setCategories((prev) => prev.filter((cat) => cat.name !== name));
        showToast(`Catégorie "${name}" supprimée`, 'success');
    }

    async function deleteProfile(id) {
        const profile = profiles.find((p) => p.id === id);
        const confirmed = await confirm(`Supprimer le profil "${profile?.name}" ?`);
        if (!confirmed) return;

        setProfiles((prev) => prev.filter((p) => p.id !== id));
        showToast(`Profil "${profile?.name}" supprimé`, 'success');
    }

    function handleAddCategory(e) {
        e.preventDefault();
        const trimmed = newCategoryName.trim();

        if (!trimmed) {
            showToast('Le nom de la catégorie ne peut pas être vide', 'error');
            return;
        };

        const alreadyExists = categories.some((cat) => cat.name.toLowerCase() === trimmed.toLowerCase());
        if (alreadyExists) {
            showToast(`La catégorie "${trimmed}" existe déjà`, 'error');
            return;
        }

        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        setCategories((prev) => [...prev, { name: trimmed, color: randomColor }]);
        setNewCategoryName('');
        showToast(`Catégorie "${trimmed}" ajoutée`, 'success');
    }

    function handleAddProfile(e) {
        e.preventDefault();
        const trimmed = newProfileName.trim();

        if (!trimmed) {
            showToast('Le nom de la catégorie ne peut pas être vide', 'error');
            return;
        };

        setProfiles((prev) => [...prev, { id: Date.now(), name: trimmed, avatar_url: null }]);
        setNewProfileName('');
        showToast(`Profil "${trimmed}" ajouté`, 'success');
    }

    return (
        <div className="content-scroll">
            <div className="phone">
                <h1 className="settings-title">Réglages</h1>

                <section className="settings-section">
                    <h2 className="settings-section-title">Catégories</h2>

                    <div className="settings-list">
                        {categories.map((cat) => (
                            <div key={cat.name} className="settings-row">
                                <span className="tag">
                                    <span className="dot" style={{ backgroundColor: cat.color }} />
                                    {cat.name}
                                </span>
                                <button className="settings-delete" onClick={() => deleteCategory(cat.name)}>
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                    </div>

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
            </div>
        </div>
    );
}