import { useState } from 'react';
import { CheckCircle, ChevronDown, Package, RotateCcw } from 'lucide-react';
import { lineTotal } from '../cartUtils';
import { useApp } from '../context/AppContext';
import { formatEgp, isActiveOrder } from '../utils';

export function Orders() {
  const {
    orderHistory, goTab, markOrderDelivered, reorderFromDelivery, reorderFromOrder,
  } = useApp();
  const [expandedDeliveries, setExpandedDeliveries] = useState<Set<string>>(new Set());

  const toggleDelivery = (deliveryId: string) => {
    setExpandedDeliveries((prev) => {
      const next = new Set(prev);
      if (next.has(deliveryId)) next.delete(deliveryId);
      else next.add(deliveryId);
      return next;
    });
  };

  return (
    <div className="scroll fade-in">
      <div className="page-header">
        <h1>Orders</h1>
        <p>Pay on delivery · demo orders auto-complete in ~90s</p>
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
        <div className="orders-list">
          {orderHistory.map((order) => {
            const itemCount = order.deliveries.reduce(
              (n, d) => n + d.items.reduce((s, i) => s + i.quantity, 0),
              0,
            );
            const active = isActiveOrder(order);
            const placed = order.placedAt.toLocaleDateString('en-EG', {
              weekday: 'short', day: 'numeric', month: 'short',
            });
            const multiDelivery = order.deliveries.length > 1;
            return (
              <div key={order.id} className="order-card">
                <div className="order-card-head">
                  <div>
                    <strong className="order-card-id">{order.id}</strong>
                    <span className={`order-status order-status--${order.status}`}>
                      {order.status === 'active' ? 'On the way' : 'Delivered'}
                    </span>
                  </div>
                  {!multiDelivery && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => reorderFromOrder(order)}
                    >
                      <RotateCcw size={13} />
                      Order again
                    </button>
                  )}
                </div>
                <p className="order-card-summary">
                  {placed} · {itemCount} items · {formatEgp(order.total)} · Pay on delivery
                </p>
                {order.deliveries.map((delivery) => {
                  const expanded = expandedDeliveries.has(delivery.id);
                  const deliveryItems = delivery.items.reduce((n, i) => n + i.quantity, 0);
                  return (
                    <div key={delivery.id} className="delivery-block compact">
                      <div className="delivery-block-head">
                        <Package size={14} />
                        <div>
                          <strong>{delivery.vendorName}</strong>
                          <span>{delivery.eta}</span>
                        </div>
                        {multiDelivery && (
                          <button
                            type="button"
                            className="btn-text"
                            onClick={() => reorderFromDelivery(delivery)}
                          >
                            <RotateCcw size={11} />
                            Reorder
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        className="order-delivery-toggle"
                        onClick={() => toggleDelivery(delivery.id)}
                        aria-expanded={expanded}
                      >
                        <span>
                          {deliveryItems} {deliveryItems === 1 ? 'item' : 'items'} · {formatEgp(delivery.subtotal)}
                        </span>
                        <ChevronDown size={14} className={expanded ? 'order-chevron-open' : ''} />
                      </button>
                      {expanded && delivery.items.map((item) => (
                        <div key={item.cartLineId} className="checkout-line">
                          <span>
                            {item.quantity > 1 ? `${item.quantity}x ` : ''}
                            {item.brand ? `${item.brand} - ${item.name}` : item.name}
                          </span>
                          <span>{formatEgp(lineTotal(item))}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
                {multiDelivery && (
                  <button
                    type="button"
                    className="btn btn-primary order-card-reorder-all"
                    onClick={() => reorderFromOrder(order)}
                  >
                    <RotateCcw size={14} />
                    Order all again
                  </button>
                )}
                {active && (
                  <button
                    type="button"
                    className="btn btn-secondary order-card-deliver-btn"
                    onClick={() => markOrderDelivered(order.id)}
                  >
                    <CheckCircle size={14} />
                    Mark delivered
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
