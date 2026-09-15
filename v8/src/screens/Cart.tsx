import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { FoodImage } from '../components/FoodImage';
import { groupCartItems, countCartItems, lineTotal } from '../cartUtils';
import { useApp } from '../context/AppContext';
import { mealPhoto } from '../lib/foodImages';
import { productPhoto } from '../lib/productImages';
import { formatEgp } from '../utils';
import type { CartItem } from '../types';

function cartItemPhoto(item: CartItem): string | null {
  if (item.source === 'restaurant') return mealPhoto(item.productId);
  return productPhoto({ name: item.name, category: 'Pantry' });
}

export function Cart() {
  const {
    cart, cartTotal, profile, setScreen, goTab,
    removeCartLine, updateCartQuantity, removeCartGroup,
  } = useApp();

  if (cart.length === 0) {
    return (
      <div className="scroll fade-in">
        <div className="page-header"><h1>Your cart</h1></div>
        <div className="empty">
          <div className="empty-icon"><ShoppingCart size={28} strokeWidth={1.5} /></div>
          <h3>Your cart is empty</h3>
          <p>Add one meal or a grocery run — then place your order here.</p>
          <button type="button" className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => goTab('home')}>
            Browse today&apos;s meals
          </button>
        </div>
      </div>
    );
  }

  const groups = groupCartItems(cart);
  const canCheckout = profile.phone.length >= 10 && profile.address.trim().length > 0;

  return (
    <div className="screen-with-footer has-bottom-nav">
      <div className="cart-scroll fade-in">
        <div className="page-header">
          <h1>Your cart</h1>
          <p>{countCartItems(cart)} items · {groups.size} {groups.size === 1 ? 'delivery' : 'deliveries'} · Pay on delivery</p>
        </div>

        {Array.from(groups.entries()).map(([key, items]) => {
          const isRestaurant = items[0].source === 'restaurant';
          const vendorName = items[0].vendorName;
          const groupSubtotal = items.reduce((s, i) => s + lineTotal(i), 0);
          return (
            <div key={key} className="cart-group">
              <div className="cart-group-header">
                <span>
                  {isRestaurant ? '🍽️' : '🛒'} From {vendorName}
                </span>
                <button
                  type="button"
                  className="cart-group-remove"
                  onClick={() => removeCartGroup(key)}
                >
                  Remove
                </button>
              </div>
              {items.map((item) => (
                <div key={item.cartLineId} className="cart-line">
                  <div className="cart-line-thumb">
                    <FoodImage
                      src={cartItemPhoto(item)}
                      fallback={item.image}
                      alt=""
                      className="cart-line-img"
                    />
                  </div>
                  <div className="cart-line-info">
                    <h4>{item.brand ? `${item.brand} — ${item.name}` : item.name}</h4>
                    <p>
                      {item.size || ''}
                      {item.fromRecipe ? ` · For ${item.fromRecipe}` : ''}
                    </p>
                    <div className="cart-qty">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateCartQuantity(item.cartLineId, item.quantity - 1)}
                        aria-label="Decrease"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateCartQuantity(item.cartLineId, item.quantity + 1)}
                        aria-label="Increase"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-line-end">
                    <div className="product-line-price">{formatEgp(lineTotal(item))}</div>
                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => removeCartLine(item.cartLineId)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="cart-group-subtotal">
                Subtotal · {formatEgp(groupSubtotal)}
              </div>
            </div>
          );
        })}

        <div className="delivery-card">
          <h3>Delivery to</h3>
          <div className="delivery-row"><span>Name</span><span>{profile.name || '—'}</span></div>
          <div className="delivery-row"><span>Phone</span><span>{profile.phone || '—'}</span></div>
          <div className="delivery-row"><span>Area</span><span>{profile.area}</span></div>
          <div className="delivery-row"><span>Address</span><span>{profile.address || 'Add in checkout'}</span></div>
        </div>

        {!canCheckout && (
          <p className="checkout-hint-warn">
            Add your phone and street address at checkout to place the order.
          </p>
        )}
      </div>

      <div className="sticky-order-bar">
        <div className="total-row">
          <span>Total</span>
          <strong>{formatEgp(cartTotal)}</strong>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canCheckout}
          onClick={() => setScreen('checkout')}
        >
          {canCheckout ? `Place order · ${formatEgp(cartTotal)}` : 'Add phone & address at checkout'}
        </button>
      </div>
    </div>
  );
}
