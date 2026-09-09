// src/components/BottomNav.jsx
import { NavLink } from 'react-router-dom';
import { CheckCircle, Calendar, ListChecks, ShoppingCart, Settings } from 'lucide-react';
import './BottomNav.css';

const NAV_ITEMS = [
  { to: '/', label: "Aujourd'hui", Icon: CheckCircle },
  { to: '/calendrier', label: 'Calendrier', Icon: Calendar },
  { to: '/carnet', label: 'Carnet', Icon: ListChecks },
  { to: '/listes', label: 'Listes', Icon: ShoppingCart },
  { to: '/reglages', label: 'Réglages', Icon: Settings },
];

export default function BottomNav() {
  return (
    <nav>
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
    </nav>
  );
}