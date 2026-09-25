// src/components/BottomNav.jsx
import { NavLink, useLocation } from 'react-router-dom';
import { CheckCircle, Calendar, ListChecks, ShoppingCart, Settings } from 'lucide-react';
import './BottomNav.css';

const NAV_ITEMS = [
  { to: '/', label: "Aujourd'hui", Icon: CheckCircle },
  { to: '/calendrier', label: 'Calendrier', Icon: Calendar },
  { to: '/carnet', label: 'Carnet', Icon: ListChecks },
  { to: '/listes', label: 'Listes', Icon: ShoppingCart },
  { to: '/reglages', label: 'Réglages', Icon: Settings },
];

const NO_NAV_PATHS = [
  '/login', 
  '/signup', 
  '/select-profile',
];

export default function BottomNav() {
  const location = useLocation();
  const isLoginPage = NO_NAV_PATHS.includes(location.pathname);

  return (
    <nav>
      {!isLoginPage &&
        <div className="nav-inner">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={20} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      }
    </nav>
  );
}