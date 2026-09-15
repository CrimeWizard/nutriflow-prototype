import { ArrowLeft, Banknote } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatEgp } from '../utils';

export function Checkout() {
  const { cart, cartTotal, profile, setProfile, placeOrder, setScreen } = useApp();
  const [notes, setNotes] = useState('');

  return (
    <div className="scroll no-nav fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button type="button" className="btn-icon" onClick={() => setScreen('cart')} aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 style={{ fontSize: 22 }}>Checkout</h1>
        </div>
      </div>

      <div className="checkout-summary">
        <h3>Order summary</h3>
        {cart.map((item, i) => (
          <div key={i} className="checkout-line">
            <span>{item.brand} {item.name}</span>
            <span>{formatEgp(item.price)}</span>
          </div>
        ))}
        <div className="checkout-line total">
          <span>Total</span>
          <span>{formatEgp(cartTotal)}</span>
        </div>
      </div>

      <div className="payment-badge">
        <Banknote size={24} color="var(--brand)" />
        <div>
          <strong>Pay on delivery</strong>
          <span>Cash to the driver when your order arrives</span>
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="checkout-phone">Phone</label>
        <input
          id="checkout-phone"
          type="tel"
          value={profile.phone}
          onChange={(e) => setProfile({ phone: e.target.value })}
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor="checkout-address">Delivery address</label>
        <input
          id="checkout-address"
          placeholder="Building, street, landmark"
          value={profile.address}
          onChange={(e) => setProfile({ address: e.target.value })}
        />
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

      <button
        type="button"
        className="btn btn-primary"
        style={{ marginTop: 8 }}
        onClick={() => placeOrder()}
        disabled={!profile.phone || cart.length === 0}
      >
        Place order · {formatEgp(cartTotal)}
      </button>
    </div>
  );
}
