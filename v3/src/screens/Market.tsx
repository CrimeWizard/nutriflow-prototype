import { Plus } from 'lucide-react';
import { shopProducts } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { formatEgp } from '../utils';

export function Market() {
  const { addToCart, showToast } = useApp();

  const addItem = (p: typeof shopProducts[0]) => {
    addToCart([{
      productId: p.id,
      brand: p.brand,
      name: p.name,
      size: p.size,
      price: p.price,
      image: p.image,
    }]);
    showToast(`Added ${p.brand} ${p.name}`);
  };

  return (
    <div className="scroll fade-in">
      <div className="page-header">
        <h1>Market</h1>
        <p>Carrefour · {shopProducts.length ? 'New Cairo' : ''}</p>
      </div>

      {shopProducts.map((p) => (
        <div key={p.id} className="product-line">
          <div className="product-line-thumb">{p.image}</div>
          <div className="product-line-info">
            <h4>{p.brand} — {p.name}</h4>
            <p>{p.size} · {p.category}</p>
          </div>
          <div className="product-line-price">{formatEgp(p.price)}</div>
          <button type="button" className="add-btn" onClick={() => addItem(p)} aria-label="Add to cart">
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>
      ))}
    </div>
  );
}
