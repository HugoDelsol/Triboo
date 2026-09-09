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
import './index.css';

function App() {
  return (
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;