import { useRef } from 'react';
import { ArrowLeft, Check, CheckSquare, ChefHat, ChevronDown, ShoppingCart, Square } from 'lucide-react';
import { SupermarketPicker } from '../components/SupermarketPicker';
import { findShopProduct, getSupermarket } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ingredientOptionsForSupermarket } from '../lib/recipeIngredients';
import { formatEgp } from '../utils';

const RECIPE_STEPS: Record<string, string[]> = {
  r1: [
    'Cook the rice until fluffy, then rest it covered for 5 minutes.',
    'Season chicken with salt, pepper, and paprika, then sear until cooked through.',
    'Slice the chicken and serve it over rice with yogurt on the side.',
  ],
  r2: [
    'Warm the oats with a splash of water or milk until thick.',
    'Stir in yogurt after cooking for a creamy texture.',
    'Top with any fruit or honey you already have at home.',
  ],
  r3: [
    'Simmer lentils until tender, then drain any extra water.',
    'Cook rice separately and warm tomatoes in a pan with spices.',
    'Combine everything in a bowl and adjust salt before serving.',
  ],
  r4: [
    'Separate the egg whites and whisk with salt and pepper.',
    'Cook gently in a nonstick pan, stirring until just set.',
    'Serve with labneh on the side.',
  ],
  r5: [
    'Drain tuna well and season with lemon, pepper, and a little olive oil if available.',
    'Slice cucumber and plate it beside the tuna.',
    'Chill for a few minutes if you want it colder and crisper.',
  ],
  r6: [
    'Spoon labneh onto a plate and season with pepper or zaatar if available.',
    'Slice cucumber and arrange beside it.',
    'Serve cold as a quick breakfast or snack plate.',
  ],
  r7: [
    'Cook rice first so it is ready when the beef finishes.',
    'Brown the beef in a hot pan, breaking it up as it cooks.',
    'Season, drain any excess fat, and serve over rice.',
  ],
  r8: [
    'Mix oats and milk in a jar or bowl.',
    'Cover and refrigerate for at least 4 hours or overnight.',
    'Stir before eating and add any fruit or yogurt you already have.',
  ],
};

export function Ingredients() {
  const {
    ingredientRecipe,
    ingredientSelections,
    ingredientIncluded,
    setIngredientSelection,
    toggleIngredientIncluded,
    addIngredientsToCart,
    closeIngredients,
    selectedSupermarketId,
    setRecipeSupermarket,
  } = useApp();

  const recipeMethodRef = useRef<HTMLElement>(null);
  const supermarket = getSupermarket(selectedSupermarketId);

  if (!ingredientRecipe) return null;

  const total = ingredientRecipe.ingredients.reduce((sum, ing) => {
    if (ingredientIncluded[ing.id] === false) return sum;
    const id = ingredientSelections[ing.id] ?? ing.defaultOptionId;
    const opt = ing.options.find((o) => o.id === id)!;
    const p = findShopProduct(selectedSupermarketId, opt.brand, opt.name);
    return sum + (p?.price ?? opt.price);
  }, 0);

  const selectedCount = ingredientRecipe.ingredients.filter((ing) => ingredientIncluded[ing.id] !== false).length;
  const steps = RECIPE_STEPS[ingredientRecipe.id] ?? [
    'Prep all ingredients before you start cooking.',
    'Cook the protein or grains first, then combine with the remaining ingredients.',
    'Taste, adjust seasoning, and serve while fresh.',
  ];

  const scrollToRecipe = () => {
    recipeMethodRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="ingredients-layout">
      <div className="ingredients-top">
        <div className="ingredients-head">
          <button type="button" className="btn-icon" onClick={closeIngredients} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div className="ingredients-head-body">
            <div className="ingredients-title-row">
              <h1>{ingredientRecipe.name}</h1>
              <button type="button" className="recipe-view-btn" onClick={scrollToRecipe}>
                View recipe
                <ChevronDown size={14} strokeWidth={2.5} />
              </button>
            </div>
            <p className="recipe-teaser">
              {ingredientRecipe.time} · {steps.length} steps · {ingredientRecipe.servings} {ingredientRecipe.servings === 1 ? 'serving' : 'servings'}
            </p>
          </div>
        </div>
        <SupermarketPicker
          selectedId={selectedSupermarketId}
          onSelect={setRecipeSupermarket}
          showTitle={false}
        />
      </div>

      <div className="ingredients-scroll">
        {ingredientRecipe.ingredients.map((ing, idx) => {
          const options = ingredientOptionsForSupermarket(ing, selectedSupermarketId);
          const included = ingredientIncluded[ing.id] !== false;
          return (
            <section key={ing.id} className={`ing-block ${included ? '' : 'ing-block-excluded'}`}>
              <div className="ing-title-row">
                <h2>
                  {idx + 1}. {ing.name}
                  <span className="ing-amount-inline">· {ing.amount}</span>
                </h2>
                <button
                  type="button"
                  className={`ing-include-toggle ${included ? 'selected' : ''}`}
                  onClick={() => toggleIngredientIncluded(ing.id)}
                  aria-label={`${included ? 'Remove' : 'Add'} ${ing.name}`}
                >
                  {included ? <CheckSquare size={18} /> : <Square size={18} />}
                  {included ? 'Included' : 'Skipped'}
                </button>
              </div>

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
                        disabled={!included}
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

        <section ref={recipeMethodRef} className="recipe-method-card" id="recipe-method">
          <div className="recipe-method-head">
            <ChefHat size={18} />
            <h2>Recipe</h2>
          </div>
          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      </div>

      <div className="sticky-footer">
        <div className="total-row">
          <span>{selectedCount} selected</span>
          <strong>{formatEgp(total)}</strong>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={addIngredientsToCart}
          disabled={selectedCount === 0}
        >
          <ShoppingCart size={18} />
          Add selected ingredients
        </button>
      </div>
    </div>
  );
}
