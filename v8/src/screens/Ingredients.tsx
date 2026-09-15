import { ArrowLeft, Check, ShoppingCart } from 'lucide-react';
import { findShopProduct, getSupermarket } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ingredientOptionsForSupermarket } from '../lib/recipeIngredients';
import { formatEgp } from '../utils';

export function Ingredients() {
  const {
    ingredientRecipe,
    ingredientSelections,
    setIngredientSelection,
    addIngredientsToCart,
    closeIngredients,
    selectedSupermarketId,
  } = useApp();

  const supermarket = getSupermarket(selectedSupermarketId);

  if (!ingredientRecipe) return null;

  const total = ingredientRecipe.ingredients.reduce((sum, ing) => {
    const id = ingredientSelections[ing.id] ?? ing.defaultOptionId;
    const opt = ing.options.find((o) => o.id === id)!;
    const p = findShopProduct(selectedSupermarketId, opt.brand, opt.name);
    return sum + (p?.price ?? opt.price);
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
        From {supermarket?.name ?? 'your supermarket'} · {ingredientRecipe.ingredients.length} items — swap any brand or size
      </div>

      <div className="ingredients-scroll">
        {ingredientRecipe.ingredients.map((ing, idx) => {
          const options = ingredientOptionsForSupermarket(ing, selectedSupermarketId);
          return (
            <section key={ing.id} className="ing-block">
              <h2>{idx + 1}. {ing.name}</h2>
              <p className="ing-amount">Needed: {ing.amount}</p>
              {options.length === 0 ? (
                <p className="ing-unavailable">Not available at {supermarket?.name ?? 'this store'}.</p>
              ) : (
                <div className="product-row">
                  {options.map((opt) => {
                    const selected = ingredientSelections[ing.id] === opt.id;
                    const shop = findShopProduct(selectedSupermarketId, opt.brand, opt.name);
                    const price = shop?.price ?? opt.price;
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
                        <div className="product-price">{formatEgp(price)}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
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
