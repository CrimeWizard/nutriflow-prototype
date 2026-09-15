import { ArrowLeft, CheckCircle, Package, RotateCcw } from 'lucide-react';
import { lineTotal } from '../cartUtils';
import { useApp } from '../context/AppContext';
import { formatEgp, isActiveOrder } from '../utils';

export function Orders() {
  const {
    orderHistory, setScreen, goTab,
    markOrderDelivered, reorderFromDelivery, reorderFromOrder,
  } = useApp();

  return (
    <div className="screen-with-footer">
      <div className="scroll no-nav fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button type="button" className="btn-icon" onClick={() => setScreen('profile')} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1 style={{ fontSize: 22 }}>My orders</h1>
            <p style={{ fontSize: 13, marginTop: 4 }}>Pay on delivery when each driver arrives</p>
          </div>
        </div>

        {orderHistory.length === 0 ? (
          <div className="empty">
            <div className="empty-icon"><Package size={28} strokeWidth={1.5} /></div>
            <h3>No orders yet</h3>
            <p>Add a meal or groceries to your cart, then place your order at checkout.</p>
            <button type="button" className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => goTab('home')}>
              Start shopping
            </button>
          </div>
        ) : (
          orderHistory.map((order) => {
            const itemCount = order.deliveries.reduce(
              (n, d) => n + d.items.reduce((s, i) => s + i.quantity, 0),
              0,
            );
            const active = isActiveOrder(order);
            return (
              <div key={order.id} className="order-card" style={{ marginBottom: 14 }}>
                <div className="order-card-head">
                  <div>
                    <strong>{order.id}</strong>
                    <span className={`order-status order-status--${order.status}`}>
                      {order.status === 'active' ? 'On the way' : 'Delivered'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => reorderFromOrder(order)}
                  >
                    <RotateCcw size={14} />
                    Order again
                  </button>
                </div>
                <div className="row">
                  <span>Placed</span>
                  <span>{order.placedAt.toLocaleDateString('en-EG', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="row">
                  <span>Items</span>
                  <span>{itemCount}</span>
                </div>
                <div className="row">
                  <span>Total</span>
                  <span>{formatEgp(order.total)}</span>
                </div>
                <div className="row">
                  <span>Payment</span>
                  <span>Pay on delivery</span>
                </div>
                {order.deliveries.map((delivery, idx) => (
                  <div key={delivery.id} className="delivery-block compact" style={{ marginTop: 12 }}>
                    <div className="delivery-block-head">
                      <Package size={16} />
                      <div>
                        <strong>Delivery {idx + 1} — {delivery.vendorName}</strong>
                        <span>{delivery.eta}</span>
                      </div>
                      <button
                        type="button"
                        className="btn-text"
                        onClick={() => reorderFromDelivery(delivery)}
                      >
                        <RotateCcw size={12} />
                        Reorder
                      </button>
                    </div>
                    {delivery.items.map((item) => (
                      <div key={item.cartLineId} className="checkout-line" style={{ fontSize: 13 }}>
                        <span>
                          {item.quantity > 1 ? `${item.quantity}× ` : ''}
                          {item.brand ? `${item.brand} — ${item.name}` : item.name}
                        </span>
                        <span>{formatEgp(lineTotal(item))}</span>
                      </div>
                    ))}
                  </div>
                ))}
                {active && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ marginTop: 12, width: '100%' }}
                    onClick={() => markOrderDelivered(order.id)}
                  >
                    <CheckCircle size={16} />
                    Mark as delivered
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
