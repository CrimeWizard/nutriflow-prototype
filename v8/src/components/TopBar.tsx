import { ShoppingCart } from 'lucide-react';
import { countCartItems } from '../cartUtils';
import { useApp } from '../context/AppContext';

export function TopBar() {
  const { cart, goTab } = useApp();
  const count = countCartItems(cart);

  return (
    <header className="topbar">
      <div className="logo">Nutri<span>Flow</span></div>
      <button
        type="button"
        className="topbar-cart"
        onClick={() => goTab('cart')}
        aria-label={count > 0 ? `Cart, ${count} items` : 'Cart'}
      >
        <ShoppingCart size={22} strokeWidth={2} />
        {count > 0 && <span className="topbar-cart-count">{count}</span>}
      </button>
    </header>
  );
}
