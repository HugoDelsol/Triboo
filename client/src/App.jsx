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
import './index.css';

function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calendrier" element={<CalendarMonth />} />
              <Route path="/calendrier/:date" element={<CalendarDay />} />
              <Route path="/carnet" element={<Notebook />} />
              <Route path="/listes" element={<ListsHome />} />
              <Route path="/listes/nouvelle" element={<CreateList />} />
              <Route path="/listes/:listId" element={<ListDetail />} />
              <Route path="/creer/:type" element={<CreateTask />} />
              <Route path="/reglages" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfirmProvider>
    </ToastProvider>
  );
}

export default App;