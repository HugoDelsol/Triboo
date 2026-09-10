// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CalendarMonth from './pages/CalendarMonth';
import CalendarDay from './pages/CalendarDay';
import Notebook from './pages/Notebook';
import ListsHome from './pages/ListsHome';
import CreateList from './pages/CreateList';
import ListDetail from './pages/ListDetail';
import CreateTask from './pages/CreateTask';
import Settings from './pages/Settings';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SelectProfile from './components/SelectProfile';
import ProfileRequiredRoute from './components/ProfileRequiredRoute';
import './index.css';

function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/select-profile" element={<ProtectedRoute><SelectProfile /></ProtectedRoute>} />
                <Route path="/" element={<ProfileRequiredRoute><Dashboard /></ProfileRequiredRoute>} />
                <Route path="/calendrier" element={<ProfileRequiredRoute><CalendarMonth /></ProfileRequiredRoute>} />
                <Route path="/calendrier/:date" element={<ProfileRequiredRoute><CalendarDay /></ProfileRequiredRoute>} />
                <Route path="/carnet" element={<ProfileRequiredRoute><Notebook /></ProfileRequiredRoute>} />
                <Route path="/listes" element={<ProfileRequiredRoute><ListsHome /></ProfileRequiredRoute>} />
                <Route path="/listes/nouvelle" element={<ProfileRequiredRoute><CreateList /></ProfileRequiredRoute>} />
                <Route path="/listes/:listId" element={<ProfileRequiredRoute><ListDetail /></ProfileRequiredRoute>} />
                <Route path="/creer/:type" element={<ProfileRequiredRoute><CreateTask /></ProfileRequiredRoute>} />
                <Route path="/reglages" element={<ProfileRequiredRoute><Settings /></ProfileRequiredRoute>} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ConfirmProvider>
    </ToastProvider>
  );
}

export default App;