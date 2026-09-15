import { useState } from 'react';
import {
  Home, ChefHat, ShoppingBag, ShoppingCart, ArrowLeft, Plus, Dumbbell,
  ChevronRight, Utensils, Zap, Check, ShoppingBasket,
} from 'lucide-react';
import {
  user, recipes, todayMeals, shopProducts, getRecipe,
  type SupermarketProduct, type Recipe,
} from './data/mockData';
import { copy } from './copy';

type Tab = 'home' | 'recipes' | 'shop' | 'cart';
type Screen = Tab | 'ingredients';

interface CartItem {
  productId: string;
  brand: string;
  name: string;
  size: string;
  price: number;
  image: string;
  fromRecipe?: string;
}

const NAV: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: copy.nav.home, icon: Home },
  { id: 'recipes', label: copy.nav.recipes, icon: ChefHat },
  { id: 'shop', label: copy.nav.shop, icon: ShoppingBag },
  { id: 'cart', label: copy.nav.cart, icon: ShoppingCart },
];

function formatEgp(n: number) {
  return `${n.toLocaleString()} EGP`;
}

function MealTypeIcon({ type }: { type: string }) {
  if (type === 'pre-workout') return <Zap size={18} />;
  if (type === 'post-workout') return <Dumbbell size={18} />;
  return <Utensils size={18} />;
}

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [screen, setScreen] = useState<Screen>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [ingredientRecipe, setIngredientRecipe] = useState<Recipe | null>(null);
  const [selections, setSelections] = useState<Record<string, string>>({});

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const isGymDay = user.gymDays.includes(
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]
  );

  const openIngredients = (recipe: Recipe) => {
    const defaults: Record<string, string> = {};
    recipe.ingredients.forEach((ing) => {
      defaults[ing.id] = ing.defaultOptionId;
    });
    setSelections(defaults);
    setIngredientRecipe(recipe);
    setScreen('ingredients');
  };

  const selectOption = (ingredientId: string, productId: string) => {
    setSelections((s) => ({ ...s, [ingredientId]: productId }));
  };

  const getSelectedProducts = (recipe: Recipe): SupermarketProduct[] => {
    return recipe.ingredients.map((ing) => {
      const id = selections[ing.id] ?? ing.defaultOptionId;
      return ing.options.find((o) => o.id === id)!;
    });
  };

  const addIngredientsToCart = () => {
    if (!ingredientRecipe) return;
    const items = getSelectedProducts(ingredientRecipe).map((p) => ({
      productId: p.id,
      brand: p.brand,
      name: p.name,
      size: p.size,
      price: p.price,
      image: p.image,
      fromRecipe: ingredientRecipe.name,
    }));
    setCart((c) => [...c, ...items]);
    showToast(copy.toast.recipeAdded(ingredientRecipe.name));
    setScreen('cart');
    setTab('cart');
    setIngredientRecipe(null);
  };

  const addTodayToCart = () => {
    const recipeIds = todayMeals.filter((m) => m.recipeId).map((m) => m.recipeId!);
    const unique = [...new Set(recipeIds)];
    const newItems: CartItem[] = [];
    unique.forEach((rid) => {
      const recipe = getRecipe(rid);
      if (!recipe) return;
      recipe.ingredients.forEach((ing) => {
        const p = ing.options.find((o) => o.id === ing.defaultOptionId)!;
        newItems.push({
          productId: p.id,
          brand: p.brand,
          name: p.name,
          size: p.size,
          price: p.price,
          image: p.image,
          fromRecipe: recipe.name,
        });
      });
    });
    setCart((c) => [...c, ...newItems]);
    showToast(copy.toast.todayAdded);
    setTab('cart');
    setScreen('cart');
  };

  const addShopItem = (p: typeof shopProducts[0]) => {
    setCart((c) => [...c, {
      productId: p.id,
      brand: p.brand,
      name: p.name,
      size: p.size,
      price: p.price,
      image: p.image,
    }]);
    showToast(copy.toast.itemAdded(p.brand, p.name));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price, 0);
  const ingredientsTotal = ingredientRecipe
    ? getSelectedProducts(ingredientRecipe).reduce((s, p) => s + p.price, 0)
    : 0;

  const goTab = (t: Tab) => {
    setTab(t);
    setScreen(t);
    setIngredientRecipe(null);
  };

  const showTopBar = screen !== 'ingredients';

  return (
    <div className="app-shell">
      {showTopBar && (
        <div className="app-topbar">
          <div className="app-logo">Nutri<span>Flow</span></div>
          <span className="proto-tag">v2 · Egypt</span>
        </div>
      )}

      {screen === 'ingredients' && ingredientRecipe ? (
        <>
          <div className="ingredients-top">
            <button
              className="back-btn"
              onClick={() => { setScreen('recipes'); setTab('recipes'); }}
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1>{copy.ingredients.title}</h1>
              <p>{ingredientRecipe.name} · {copy.ingredients.subtitle}</p>
            </div>
          </div>

          <div className="ingredients-hint">
            {copy.ingredients.progress(ingredientRecipe.ingredients.length)} — swap any brand or size below
          </div>

          <div className="ingredients-scroll">
            {ingredientRecipe.ingredients.map((ing, idx) => (
              <div className="ingredient-block" key={ing.id}>
                <h2>{idx + 1}. {ing.name}</h2>
                <p className="ingredient-need">{copy.ingredients.needAmount(ing.amount)}</p>
                <div className="product-options">
                  {ing.options.map((opt) => (
                    <button
                      key={opt.id}
                      className={`product-option ${selections[ing.id] === opt.id ? 'selected' : ''}`}
                      onClick={() => selectOption(ing.id, opt.id)}
                    >
                      <div className="product-option-check">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <div className="product-thumb">{opt.image}</div>
                      <div className="brand">{opt.brand}</div>
                      <div className="name">{opt.name}</div>
                      <div className="size">{opt.size}</div>
                      <div className="price">{formatEgp(opt.price)}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="ingredients-footer">
            <div className="footer-total">
              <span>{copy.ingredients.total}</span>
              <strong>{formatEgp(ingredientsTotal)}</strong>
            </div>
            <button className="cta-primary" onClick={addIngredientsToCart}>
              <ShoppingCart size={18} />
              {copy.ingredients.addToCart}
            </button>
          </div>
        </>
      ) : (
        <div className="screen">
          {screen === 'home' && (
            <>
              <div className="screen-header">
                <h1>{copy.home.greeting(user.name)}</h1>
                <p>{user.area} · {isGymDay ? copy.home.gymDay : copy.home.restDay}</p>
              </div>

              <p className="value-line">{copy.home.valueProp}</p>

              {isGymDay && (
                <div className="gym-banner">
                  <div className="gym-banner-icon">
                    <Dumbbell size={18} />
                  </div>
                  <div className="gym-banner-text">
                    <strong>{copy.home.gymPill(user.gymTime)}</strong>
                    {copy.home.gymPillSub}
                  </div>
                </div>
              )}

              <p className="section-label">{copy.home.todayMeals}</p>

              {todayMeals.map((meal) => (
                <div
                  className={`meal-card ${meal.recipeId ? 'has-action' : ''}`}
                  key={meal.time}
                  onClick={meal.recipeId ? () => {
                    const r = getRecipe(meal.recipeId!);
                    if (r) openIngredients(r);
                  } : undefined}
                  role={meal.recipeId ? 'button' : undefined}
                >
                  <div className="meal-card-main">
                    <div className={`meal-icon ${meal.type === 'pre-workout' ? 'pre' : meal.type === 'post-workout' ? 'post' : ''}`}>
                      <MealTypeIcon type={meal.type} />
                    </div>
                    <div className="meal-info">
                      <div className="meal-meta">{meal.time} · {meal.label}</div>
                      <h3>{meal.title}</h3>
                    </div>
                  </div>
                  {meal.recipeId && (
                    <div className="meal-card-action">
                      {copy.home.shopIngredients}
                      <ChevronRight size={16} />
                    </div>
                  )}
                </div>
              ))}

              <div className="cta-block">
                <button className="cta-primary" onClick={addTodayToCart}>
                  <ShoppingBasket size={18} />
                  {copy.home.addAllCta}
                </button>
                <p className="cta-hint">{copy.home.addAllHint}</p>
              </div>
            </>
          )}

          {screen === 'recipes' && (
            <>
              <div className="screen-header">
                <h1>{copy.recipes.title}</h1>
                <p>{copy.recipes.subtitle}</p>
              </div>

              {recipes.map((recipe) => (
                <div className="recipe-card" key={recipe.id}>
                  <div className="recipe-visual">{recipe.image}</div>
                  <div className="recipe-body">
                    <h3>{recipe.name}</h3>
                    <p className="recipe-meta">{copy.recipes.meta(recipe.time, recipe.ingredients.length)}</p>
                    <div className="recipe-tags">
                      {recipe.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                    </div>
                    <button className="recipe-cta" onClick={() => openIngredients(recipe)}>
                      <ShoppingBag size={16} />
                      {copy.recipes.shopIngredients}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {screen === 'shop' && (
            <>
              <div className="screen-header">
                <h1>{copy.shop.title}</h1>
                <p>{copy.shop.subtitle}</p>
              </div>
              {shopProducts.map((p) => (
                <div className="shop-row" key={p.id}>
                  <div className="shop-thumb">{p.image}</div>
                  <div className="info">
                    <h4>{p.brand} — {p.name}</h4>
                    <p>{p.size} · {p.category}</p>
                  </div>
                  <div className="price-col">
                    <div className="price">{formatEgp(p.price)}</div>
                  </div>
                  <button className="add" onClick={() => addShopItem(p)} aria-label="Add to cart">
                    <Plus size={18} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </>
          )}

          {screen === 'cart' && (
            <>
              <div className="screen-header">
                <h1>{copy.cart.title}</h1>
                <p>{copy.cart.items(cart.length)}</p>
              </div>

              {cart.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <ShoppingCart size={28} strokeWidth={1.5} />
                  </div>
                  <h3>{copy.cart.empty}</h3>
                  <p>{copy.cart.emptyHint}</p>
                </div>
              ) : (
                <>
                  <div className="cart-list">
                    {cart.map((item, i) => (
                      <div className="cart-item" key={`${item.productId}-${i}`}>
                        <div className="cart-thumb">{item.image}</div>
                        <div className="info">
                          <h4>{item.brand} — {item.name}</h4>
                          <p>
                            {item.size}
                            {item.fromRecipe ? ` · ${copy.cart.fromRecipe(item.fromRecipe)}` : ''}
                          </p>
                        </div>
                        <div className="item-price">{formatEgp(item.price)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="cart-checkout">
                    <div className="footer-total">
                      <span>{copy.cart.total}</span>
                      <strong>{formatEgp(cartTotal)}</strong>
                    </div>
                    <button className="checkout-btn" onClick={() => showToast(copy.toast.orderPlaced)}>
                      <strong>{copy.cart.checkout}</strong>
                      <span>{copy.cart.checkoutSub}</span>
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {screen !== 'ingredients' && (
        <nav className="bottom-nav">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${tab === id ? 'active' : ''}`}
              onClick={() => goTab(id)}
            >
              <Icon />
              {label}
              {id === 'cart' && cart.length > 0 && (
                <span className="nav-badge">{cart.length}</span>
              )}
            </button>
          ))}
        </nav>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
