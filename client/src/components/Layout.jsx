// src/components/Layout.jsx
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <>
      <div className="page-container">
        <Outlet />
      </div>
      <BottomNav />
    </>
  );
}