import { CalendarCheck, ChefHat, Home, Package, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Tab } from '../types';

const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'cook-at-home', label: 'Cook', icon: ChefHat },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'today-plan', label: 'Plan', icon: CalendarCheck },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const { tab, goTab, orderHistory } = useApp();
  const activeOrderCount = orderHistory.filter((order) => order.status === 'active').length;

  return (
    <nav className="bottom-nav">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={`nav-btn ${tab === id ? 'active' : ''}`}
          onClick={() => goTab(id)}
        >
          <Icon />
          {label}
          {id === 'orders' && activeOrderCount > 0 && (
            <span className="nav-count">{activeOrderCount}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
