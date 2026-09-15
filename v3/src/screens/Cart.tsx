import { ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatEgp } from '../utils';

export function Cart() {
  const { cart, cartTotal, profile, setScreen } = useApp();

  if (cart.length === 0) {
    return (
      <div className="scroll fade-in">
        <div className="page-header">
          <h1>Your cart</h1>
        </div>
        <div className="empty">
          <div className="empty-icon">
            <ShoppingCart size={28} strokeWidth={1.5} />
          </div>
          <h3>Your cart is empty</h3>
          <p>Shop ingredients from a recipe, or add today&apos;s meals from Home.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scroll fade-in">
      <div className="page-header">
        <h1>Your cart</h1>
        <p>{cart.length} item{cart.length === 1 ? '' : 's'}</p>
      </div>

      <div className="cart-lines">
        {cart.map((item, i) => (
          <div key={`${item.productId}-${i}`} className="cart-line">
            <div className="cart-line-thumb">{item.image}</div>
            <div className="cart-line-info">
              <h4>{item.brand} — {item.name}</h4>
              <p>
                {item.size}
                {item.fromRecipe ? ` · For ${item.fromRecipe}` : ''}
              </p>
            </div>
            <div className="product-line-price">{formatEgp(item.price)}</div>
          </div>
        ))}
      </div>

      <div className="delivery-card">
        <h3>Delivery</h3>
        <div className="delivery-row">
          <span>Name</span>
          <span>{profile.name}</span>
        </div>
        <div className="delivery-row">
          <span>Phone</span>
          <span>{profile.phone}</span>
        </div>
        <div className="delivery-row">
          <span>Area</span>
          <span>{profile.area}</span>
        </div>
        {profile.address && (
          <div className="delivery-row">
            <span>Address</span>
            <span>{profile.address}</span>
          </div>
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
