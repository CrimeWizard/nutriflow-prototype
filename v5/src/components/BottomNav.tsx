import { Home, Store, ShoppingCart, User, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Tab } from '../types';

const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'restaurants', label: 'Eat out', icon: UtensilsCrossed },
  { id: 'groceries', label: 'Groceries', icon: Store },
  { id: 'cart', label: 'Cart', icon: ShoppingCart },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const { tab, goTab, cart } = useApp();

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
          {id === 'cart' && cart.length > 0 && (
            <span className="nav-count">{cart.length}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
