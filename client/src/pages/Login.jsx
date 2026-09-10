// client/src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Login.css'

export default function LoginPage() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        try {
            await login(name, password);
            navigate('/select-profile');
        } catch (err) {
            showToast(err.message, "error");
        }
    } return (
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
                {error && <p className="login-error">{error}</p>}
                <button className="login-submit" type="submit">Se connecter</button>
            </form>
            <p className="login-switch">
                Pas encore de foyer ? <Link to="/signup">En créer un</Link>
            </p>
        </div>
    );
}