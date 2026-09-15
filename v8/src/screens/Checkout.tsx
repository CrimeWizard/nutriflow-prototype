import { ArrowLeft, Banknote, Truck } from 'lucide-react';
import { useState } from 'react';
import { buildDeliveryGroups, countCartItems, lineTotal } from '../cartUtils';
import { useApp } from '../context/AppContext';
import { formatEgp } from '../utils';

export function Checkout() {
  const { cart, cartTotal, profile, setProfile, placeOrder, setScreen } = useApp();
  const [notes, setNotes] = useState('');
  const [triedSubmit, setTriedSubmit] = useState(false);
  const deliveries = buildDeliveryGroups(cart);

  const phoneOk = profile.phone.length >= 10;
  const addressOk = profile.address.trim().length > 0;
  const canPlace = phoneOk && addressOk && cart.length > 0;

  const handlePlace = () => {
    setTriedSubmit(true);
    if (!canPlace) return;
    placeOrder();
  };

  return (
    <div className="screen-with-footer">
      <div className="scroll no-nav fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button type="button" className="btn-icon" onClick={() => setScreen('cart')} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1 style={{ fontSize: 22 }}>Place order</h1>
            <p style={{ fontSize: 13, marginTop: 4 }}>
              Review {deliveries.length} {deliveries.length === 1 ? 'delivery' : 'deliveries'} · pay cash on arrival
            </p>
          </div>
        </div>

        {deliveries.map((delivery, idx) => (
          <div key={delivery.id} className="delivery-block">
            <div className="delivery-block-head">
              <Truck size={18} />
              <div>
                <strong>
                  Delivery {idx + 1} — {delivery.vendorName}
                </strong>
                <span>{delivery.eta}</span>
              </div>
            </div>
            {delivery.items.map((item) => (
              <div key={item.cartLineId} className="checkout-line">
                <span>
                  {item.quantity > 1 ? `${item.quantity}× ` : ''}
                  {item.brand ? `${item.brand} — ${item.name}` : item.name}
                </span>
                <span>{formatEgp(lineTotal(item))}</span>
              </div>
            ))}
            <div className="checkout-line sub">
              <span>Subtotal</span>
              <span>{formatEgp(delivery.subtotal)}</span>
            </div>
          </div>
        ))}

        <div className="checkout-summary">
          <div className="checkout-line total">
            <span>Total ({countCartItems(cart)} items)</span>
            <span>{formatEgp(cartTotal)}</span>
          </div>
        </div>

        <div className="payment-badge">
          <Banknote size={24} color="var(--brand)" />
          <div>
            <strong>Pay on delivery — cash only</strong>
            <span>No card or wallet in this demo. Have the exact amount ready for each driver.</span>
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="checkout-phone">Phone *</label>
          <input
            id="checkout-phone"
            type="tel"
            placeholder="01xxxxxxxxx"
            value={profile.phone}
            onChange={(e) => setProfile({ phone: e.target.value })}
          />
          {triedSubmit && !phoneOk && (
            <p className="field-error">Enter a valid phone number to place your order.</p>
          )}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="checkout-address">Delivery address *</label>
          <input
            id="checkout-address"
            placeholder="Building, street, landmark"
            value={profile.address}
            onChange={(e) => setProfile({ address: e.target.value })}
          />
          {triedSubmit && !addressOk && (
            <p className="field-error">Street address is required so the driver can find you.</p>
          )}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="notes">Order notes (optional)</label>
          <textarea
            id="notes"
            rows={2}
            placeholder="e.g. Call when you arrive"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="sticky-order-bar no-nav">
        <div className="total-row">
          <span>{deliveries.length} {deliveries.length === 1 ? 'delivery' : 'deliveries'}</span>
          <strong>{formatEgp(cartTotal)}</strong>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handlePlace}
        >
          Confirm order · {formatEgp(cartTotal)}
        </button>
      </div>
    </div>
  );
}
