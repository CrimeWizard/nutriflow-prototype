import { Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatEgp } from '../utils';

export function OrderSuccess() {
  const { lastOrder, goTab } = useApp();

  if (!lastOrder) return null;

  return (
    <div className="success-screen fade-in">
      <div className="success-icon">
        <Check size={36} strokeWidth={2.5} />
      </div>
      <h1>Order placed</h1>
      <p>We&apos;re preparing your groceries. Pay the driver on delivery.</p>

      <div className="order-card">
        <div className="row">
          <span>Order</span>
          <span>{lastOrder.id}</span>
        </div>
        <div className="row">
          <span>Items</span>
          <span>{lastOrder.items.length}</span>
        </div>
        <div className="row">
          <span>Total</span>
          <span>{formatEgp(lastOrder.total)}</span>
        </div>
        <div className="row">
          <span>Estimated</span>
          <span>{lastOrder.eta}</span>
        </div>
        <div className="row">
          <span>Payment</span>
          <span>Pay on delivery</span>
        </div>
      </div>

      <button type="button" className="btn btn-primary" onClick={() => goTab('home')}>
        Back to home
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        style={{ marginTop: 10 }}
        onClick={() => goTab('recipes')}
      >
        Browse more recipes
      </button>
    </div>
  );
}
