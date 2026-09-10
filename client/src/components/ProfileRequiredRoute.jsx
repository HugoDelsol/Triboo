// client/src/components/ProfileRequiredRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfileRequiredRoute({ children }) {
    const { isAuthenticated, profileId, isLoading } = useAuth();

    if (isLoading) return null;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!profileId) return <Navigate to="/select-profile" replace />;

    return children;
}