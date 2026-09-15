import { ArrowLeft, Plus, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatEgp } from '../utils';

export function RestaurantMenu() {
  const { activeRestaurant, closeRestaurant, addMealToCart } = useApp();

  if (!activeRestaurant) return null;

  return (
    <div className="ingredients-layout">
      <div className="ingredients-head">
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <button type="button" className="btn-icon" onClick={closeRestaurant} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1>{activeRestaurant.name}</h1>
            <p>
              {activeRestaurant.cuisine} · {activeRestaurant.area}
              {' · '}
              <Star size={12} style={{ display: 'inline', verticalAlign: -1 }} fill="currentColor" />
              {activeRestaurant.rating}
            </p>
          </div>
        </div>
      </div>

      <div className="ingredients-hint">
        Delivery {activeRestaurant.deliveryMins} · Pay on delivery
      </div>

      <div className="ingredients-scroll">
        {activeRestaurant.meals.map((meal) => (
          <div key={meal.id} className="menu-item">
            <div className="menu-item-thumb">{meal.image}</div>
            <div className="menu-item-body">
              <h3>{meal.name}</h3>
              <p className="menu-desc">{meal.description}</p>
              <div className="menu-nutrition">
                {meal.protein}g protein · {meal.calories} cal
              </div>
              <div className="tags" style={{ marginTop: 8 }}>
                {meal.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <div className="menu-item-action">
              <span className="menu-price">{formatEgp(meal.price)}</span>
              <button
                type="button"
                className="add-btn"
                onClick={() => addMealToCart(activeRestaurant, meal.id)}
                aria-label={`Add ${meal.name}`}
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
