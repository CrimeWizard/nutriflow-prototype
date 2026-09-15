import { ArrowLeft, Check, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatEgp } from '../utils';

export function Ingredients() {
  const {
    ingredientRecipe,
    ingredientSelections,
    setIngredientSelection,
    addIngredientsToCart,
    closeIngredients,
  } = useApp();

  if (!ingredientRecipe) return null;

  const total = ingredientRecipe.ingredients.reduce((sum, ing) => {
    const id = ingredientSelections[ing.id] ?? ing.defaultOptionId;
    const p = ing.options.find((o) => o.id === id)!;
    return sum + p.price;
  }, 0);

  return (
    <div className="ingredients-layout">
      <div className="ingredients-head">
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <button type="button" className="btn-icon" onClick={closeIngredients} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1>Shop ingredients</h1>
            <p>{ingredientRecipe.name}</p>
          </div>
        </div>
      </div>

      <div className="ingredients-hint">
        {ingredientRecipe.ingredients.length} items · defaults selected — swap any brand or size
      </div>

      <div className="ingredients-scroll">
        {ingredientRecipe.ingredients.map((ing, idx) => (
          <section key={ing.id} className="ing-block">
            <h2>{idx + 1}. {ing.name}</h2>
            <p className="ing-amount">Needed: {ing.amount}</p>
            <div className="product-row">
              {ing.options.map((opt) => {
                const selected = ingredientSelections[ing.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`product-card ${selected ? 'selected' : ''}`}
                    onClick={() => setIngredientSelection(ing.id, opt.id)}
                  >
                    <div className="product-check">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <div className="product-thumb">{opt.image}</div>
                    <div className="product-brand">{opt.brand}</div>
                    <div className="product-name">{opt.name}</div>
                    <div className="product-size">{opt.size}</div>
                    <div className="product-price">{formatEgp(opt.price)}</div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="sticky-footer">
        <div className="total-row">
          <span>Total</span>
          <strong>{formatEgp(total)}</strong>
        </div>
        <button type="button" className="btn btn-primary" onClick={addIngredientsToCart}>
          <ShoppingCart size={18} />
          Add to cart
        </button>
      </div>
    </div>
  );
}
