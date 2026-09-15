import { ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatEgp } from '../utils';
import type { CartItem } from '../types';

function groupCart(items: CartItem[]) {
  const groups: Record<string, CartItem[]> = {};
  items.forEach((item) => {
    const key = `${item.source}:${item.vendorName}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return Object.entries(groups);
}

export function Cart() {
  const { cart, cartTotal, profile, setScreen } = useApp();

  if (cart.length === 0) {
    return (
      <div className="scroll fade-in">
        <div className="page-header"><h1>Your cart</h1></div>
        <div className="empty">
          <div className="empty-icon"><ShoppingCart size={28} strokeWidth={1.5} /></div>
          <h3>Your cart is empty</h3>
          <p>Add meals from a restaurant or groceries from the supermarket.</p>
        </div>
      </div>
    );
  }

  const groups = groupCart(cart);

  return (
    <div className="scroll fade-in">
      <div className="page-header">
        <h1>Your cart</h1>
        <p>{cart.length} items · Pay on delivery</p>
      </div>

      {groups.map(([key, items]) => {
        const [, vendorName] = key.split(':');
        const isRestaurant = items[0].source === 'restaurant';
        return (
          <div key={key} className="cart-group">
            <div className="cart-group-header">
              {isRestaurant ? '🍽️' : '🛒'} From {vendorName}
            </div>
            {items.map((item, i) => (
              <div key={`${item.productId}-${i}`} className="cart-line">
                <div className="cart-line-thumb">{item.image}</div>
                <div className="cart-line-info">
                  <h4>{item.brand ? `${item.brand} — ${item.name}` : item.name}</h4>
                  <p>
                    {item.size || ''}
                    {item.fromRecipe ? ` · For ${item.fromRecipe}` : ''}
                  </p>
                </div>
                <div className="product-line-price">{formatEgp(item.price)}</div>
              </div>
            ))}
          </div>
        );
      })}

      <div className="delivery-card">
        <h3>Delivery to</h3>
        <div className="delivery-row"><span>Name</span><span>{profile.name}</span></div>
        <div className="delivery-row"><span>Phone</span><span>{profile.phone}</span></div>
        <div className="delivery-row"><span>Area</span><span>{profile.area}</span></div>
        {profile.address && (
          <div className="delivery-row"><span>Address</span><span>{profile.address}</span></div>
        )}
      </div>

      <div className="total-row" style={{ marginBottom: 16 }}>
        <span>Total</span>
        <strong>{formatEgp(cartTotal)}</strong>
      </div>

      <button type="button" className="btn btn-primary" onClick={() => setScreen('checkout')}>
        Continue to checkout
      </button>
    </div>
  );
}
