import { Plus, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatEgp } from '../utils';

const SUPPLEMENTS = [
  {
    id: 'sup-whey',
    brand: 'Optimum Nutrition',
    name: 'Gold Standard Whey',
    size: '2 lb · Double rich chocolate',
    price: 2450,
    image: '🥤',
    note: '24g protein per scoop',
  },
  {
    id: 'sup-creatine',
    brand: 'MyProtein',
    name: 'Creatine Monohydrate',
    size: '250g · Unflavored',
    price: 980,
    image: '⚡',
    note: 'Daily strength support',
  },
  {
    id: 'sup-omega',
    brand: 'Now Foods',
    name: 'Omega-3 Softgels',
    size: '100 softgels',
    price: 760,
    image: '💧',
    note: 'Heart and recovery support',
  },
  {
    id: 'sup-electrolytes',
    brand: 'Hydralyte',
    name: 'Electrolyte Tablets',
    size: '20 tablets · Citrus',
    price: 420,
    image: '🍋',
    note: 'For training days',
  },
];

export function Supplements() {
  const { addToCart, showToast } = useApp();

  const addSupplement = (item: typeof SUPPLEMENTS[number]) => {
    addToCart([{
      productId: item.id,
      brand: item.brand,
      name: item.name,
      size: item.size,
      price: item.price,
      image: item.image,
      source: 'supermarket',
      vendorName: 'NutriFlow Supplements',
    }]);
    showToast(`Added ${item.name}`);
  };

  return (
    <div className="scroll fade-in">
      <div className="page-header">
        <h1>Supplements</h1>
        <p>Order gym basics with your food plan</p>
      </div>

      <div className="supplement-note">
        <ShieldCheck size={18} />
        <span>Demo catalog · check labels and suitability before use</span>
      </div>

      <div className="supplement-grid">
        {SUPPLEMENTS.map((item) => (
          <article key={item.id} className="supplement-card">
            <div className="supplement-visual">{item.image}</div>
            <div className="supplement-copy">
              <p>{item.brand}</p>
              <h3>{item.name}</h3>
              <span>{item.size}</span>
              <small>{item.note}</small>
            </div>
            <div className="supplement-footer">
              <strong>{formatEgp(item.price)}</strong>
              <button
                type="button"
                className="add-btn"
                onClick={() => addSupplement(item)}
                aria-label={`Add ${item.name}`}
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
