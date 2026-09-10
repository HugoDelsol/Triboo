// client/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return null; // ou un petit loader
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return children;
}