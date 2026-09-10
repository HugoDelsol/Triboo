// client/src/pages/SignupPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const { signup } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            await signup(name, password);
            navigate('/select-profile');
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="login-page">
            <div className="login-logo">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="11" stroke="#E8B23D" strokeWidth="1.5" />
                    <path d="M7 12.5L10.5 16L17 8.5" stroke="#E8B23D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <h1 className="login-title">Triboo</h1>

            <form className="login-card" onSubmit={handleSubmit}>
                <div className="login-field">
                    <input
                        type="text"
                        placeholder="Nom du foyer"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="login-field">
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="login-field">
                    <input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                {error && <p className="login-error">{error}</p>}
                <button className="login-submit" type="submit">Créer mon foyer</button>
            </form>

            <p className="login-switch">
                Déjà un foyer ? <Link to="/login">Se connecter</Link>
            </p>
        </div>
    );
}