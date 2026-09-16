import { Check, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatEgp } from '../utils';

export function OrderSuccess() {
  const { lastOrder, goTab, setScreen } = useApp();

  if (!lastOrder) return null;

  const itemCount = lastOrder.deliveries.reduce(
    (s, d) => s + d.items.reduce((n, i) => n + i.quantity, 0),
    0,
  );

  return (
    <div className="success-screen fade-in">
      <div className="success-icon">
        <Check size={36} strokeWidth={2.5} />
      </div>
      <h1>You&apos;re all set</h1>
      <p>
        {lastOrder.deliveries.length === 1
          ? 'Your order is confirmed. Keep your phone nearby — pay the driver in cash when they arrive.'
          : `${lastOrder.deliveries.length} deliveries confirmed. Pay each driver in cash when they arrive — no app payment in this demo.`}
      </p>

      <div className="order-card">
        <div className="row">
          <span>Order</span>
          <span>{lastOrder.id}</span>
        </div>
        <div className="row">
          <span>Items</span>
          <span>{itemCount}</span>
        </div>
        <div className="row">
          <span>Total</span>
          <span>{formatEgp(lastOrder.total)}</span>
        </div>
        <div className="row">
          <span>Payment</span>
          <span>Pay on delivery</span>
        </div>
      </div>

      {lastOrder.deliveries.map((delivery, idx) => (
        <div key={delivery.id} className="delivery-block compact">
          <div className="delivery-block-head">
            <Truck size={16} />
            <div>
              <strong>Delivery {idx + 1} — {delivery.vendorName}</strong>
              <span>{delivery.eta}</span>
            </div>
          </div>
          <p className="delivery-block-items">
            {delivery.items.length} items · {formatEgp(delivery.subtotal)}
          </p>
        </div>
      ))}

      <button type="button" className="btn btn-primary" onClick={() => setScreen('orders')}>
        View my orders
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        style={{ marginTop: 10 }}
        onClick={() => goTab('home')}
      >
        Back to home
      </button>
    </div>
  );
}
