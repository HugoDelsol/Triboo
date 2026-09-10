// client/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { checkSession, login as apiLogin, signup as apiSignup, logout as apiLogout } from '../api/auth';
import { selectProfile as apiSelectProfile } from '../api/profiles';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [householdName, setHouseholdName] = useState(null);
    const [profileId, setProfileId] = useState(null);
    const [profileName, setProfileName] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkSession()
            .then((data) => {
                setIsAuthenticated(!!data);
                setHouseholdName(data?.householdName ?? null);
                setProfileId(data?.profileId ?? null);
                setProfileName(data?.profileName ?? null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    async function login(name, password) {
        const data = await apiLogin(name, password);
        setIsAuthenticated(true);
        setHouseholdName(data.householdName);
        setProfileId(null); // pas encore de profil choisi juste après le login
        setProfileName(null);
    }

    async function signup(name, password) {
        const data = await apiSignup(name, password);
        setIsAuthenticated(true);
        setHouseholdName(data.householdName);
        setProfileId(null);
        setProfileName(null);
    }

    async function selectProfile(id) {
        const data = await apiSelectProfile(id);
        setProfileId(data.profileId);
        setProfileName(data.profileName);
    }

    async function logout() {
        await apiLogout();
        setIsAuthenticated(false);
        setHouseholdName(null);
        setProfileId(null);
        setProfileName(null);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, householdName, profileId, profileName, login, signup, selectProfile, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}