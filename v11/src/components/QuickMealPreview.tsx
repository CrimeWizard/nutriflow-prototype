import { ShoppingCart, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatEgp } from '../utils';

export function QuickMealPreview() {
  const {
    quickMealPreview, closeQuickMealPreview, confirmQuickMealAdd,
  } = useApp();

  if (!quickMealPreview) return null;

  const { title, resolved } = quickMealPreview;
  const canAdd = resolved.items.length > 0;

  return (
    <div className="sheet-backdrop" onClick={closeQuickMealPreview}>
      <div
        className="sheet-panel"
        role="dialog"
        aria-labelledby="quick-meal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-head">
          <h2 id="quick-meal-title">{title}</h2>
          <button type="button" className="btn-icon" onClick={closeQuickMealPreview} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <p className="sheet-sub">We&apos;ll add these to your cart — review before checkout.</p>

        {resolved.lines.length > 0 && (
          <ul className="sheet-lines">
            {resolved.lines.map((line) => (
              <li key={`${line.vendorName}-${line.label}`}>
                <span>{line.label}</span>
                <span className="sheet-line-meta">
                  {line.vendorName} · {formatEgp(line.price)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {resolved.unavailable.length > 0 && (
          <div className="sheet-warn">
            <strong>Not available</strong>
            <p>{resolved.unavailable.join(' · ')}</p>
          </div>
        )}

        <div className="sheet-total">
          <span>Estimated total</span>
          <strong>{formatEgp(resolved.total)}</strong>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          disabled={!canAdd}
          onClick={confirmQuickMealAdd}
        >
          <ShoppingCart size={18} />
          Add to cart
        </button>
      </div>
    </div>
  );
}
