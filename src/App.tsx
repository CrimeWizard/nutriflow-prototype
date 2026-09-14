import { useEffect, useState } from 'react';
import {
  Home, ShoppingBag, ChefHat, Calendar, MessageCircle, User,
  Dumbbell, Send, Plus, Check, Upload, Sun, Moon,
} from 'lucide-react';
import {
  userProfile, products, recipes, todayMeals, inventory,
  dietPlan, aiSuggestions, getProduct, type Product, type ChatMessage,
} from './data/mockData';

type Tab = 'home' | 'shop' | 'recipes' | 'plan' | 'coach' | 'profile';
type ShopCategory = 'supermarket' | 'restaurant' | 'supplement' | 'gear' | 'utility';
type Theme = 'dark' | 'light';

const consumed = { calories: 1420, protein: 98 };
const NAV: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'recipes', label: 'Recipes', icon: ChefHat },
  { id: 'plan', label: 'Plan', icon: Calendar },
  { id: 'coach', label: 'Coach', icon: MessageCircle },
  { id: 'profile', label: 'Profile', icon: User },
];

const SHOP_TABS: { id: ShopCategory; label: string }[] = [
  { id: 'supermarket', label: 'Supermarket' },
  { id: 'restaurant', label: 'Restaurants' },
  { id: 'supplement', label: 'Supplements' },
  { id: 'gear', label: 'Gym Gear' },
  { id: 'utility', label: 'Utilities' },
];

const MEAL_ICONS: Record<string, string> = {
  'pre-workout': '⚡',
  'post-workout': '💪',
  snack: '🍫',
  meal: '🍽️',
};

function MacroRing() {
  const pct = Math.round((consumed.calories / userProfile.dailyCalories) * 100);
  const circ = 2 * Math.PI * 42;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="card macro-ring">
      <div className="ring">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface-2)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="42" fill="none" stroke="var(--accent)" strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          />
        </svg>
        <div className="ring-center">
          <span>{pct}%</span>
          <small>calories</small>
        </div>
      </div>
      <div className="macro-stats">
        <div className="macro-row">
          <span>Calories</span>
          <div className="macro-bar">
            <div className="macro-bar-fill" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
          </div>
          <span>{consumed.calories}/{userProfile.dailyCalories}</span>
        </div>
        <div className="macro-row">
          <span>Protein</span>
          <div className="macro-bar">
            <div
              className="macro-bar-fill"
              style={{
                width: `${(consumed.protein / userProfile.dailyProtein) * 100}%`,
                background: 'var(--blue)',
              }}
            />
          </div>
          <span>{consumed.protein}g/{userProfile.dailyProtein}g</span>
        </div>
        <div className="macro-row">
          <span>Budget</span>
          <div className="macro-bar">
            <div className="macro-bar-fill" style={{ width: '72%', background: 'var(--orange)' }} />
          </div>
          <span>$86/${userProfile.budget}</span>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return (
    <div className="product-card">
      <div className="product-emoji">{product.image}</div>
      <div className="product-info">
        <h4>{product.name}</h4>
        <div className="meta">
          {product.protein > 0 && `${product.protein}g protein · `}
          {product.calories > 0 && `${product.calories} cal`}
          {product.vendor && ` · ${product.vendor}`}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        <span className="product-price">${product.price.toFixed(2)}</span>
        <button
          onClick={onAdd}
          style={{
            width: 28, height: 28, borderRadius: 8, background: 'var(--accent-glow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)',
          }}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('nutriflow-theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });
  const [tab, setTab] = useState<Tab>('home');
  const [shopCat, setShopCat] = useState<ShopCategory>('supermarket');
  const [cart, setCart] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [inbodyUploaded, setInbodyUploaded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: `Hey ${userProfile.name}! 👋 I'm your NutriFlow coach. Ask me about meals, groceries, or your gym plan.` },
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nutriflow-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (id: string, name?: string) => {
    setCart((c) => [...c, id]);
    showToast(`Added ${name ?? 'item'} to cart`);
  };

  const addRecipeToCart = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;
    recipe.ingredients.forEach((ing) => addToCart(ing.productId));
    showToast(`Added ${recipe.name} ingredients to cart`);
  };

  const sendChat = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setChatInput('');
    setTimeout(() => {
      const reply = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    }, 800);
  };

  const isGymDay = userProfile.gymDays.includes(
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]
  );

  const filteredProducts = products.filter((p) => p.category === shopCat);
  const activeRecipe = recipes.find((r) => r.id === selectedRecipe);

  return (
    <div className="app-shell">
      {cart.length > 0 && (
        <div className="cart-badge">{cart.length}</div>
      )}

      <div className="status-bar">
        <span>9:41</span>
        <span style={{ fontWeight: 700, color: 'var(--accent)' }}>NutriFlow</span>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun /> : <Moon />}
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>

      <div className="screen">
        {tab === 'home' && (
          <>
            <div className="screen-header">
              <h1>Good evening, {userProfile.name}</h1>
              <p>{userProfile.goal} · {userProfile.weight}kg → {userProfile.targetWeight}kg</p>
            </div>

            {isGymDay && (
              <div className="gym-banner">
                <Dumbbell size={18} color="var(--accent)" />
                <span>Gym today at <strong>{userProfile.gymTime}</strong> — meals optimized around your session</span>
              </div>
            )}

            <MacroRing />

            <div className="section-title">
              <span>Today's meals</span>
              <button onClick={() => setTab('plan')}>View plan</button>
            </div>

            <div className="meal-timeline">
              {todayMeals.map((meal) => (
                <div className="meal-item" key={meal.time}>
                  <div className={`meal-dot ${meal.type}`}>
                    {MEAL_ICONS[meal.type]}
                  </div>
                  <div className="meal-content">
                    <div className="time">{meal.time} · {meal.label}</div>
                    <h4>{meal.suggestion}</h4>
                    <p>
                      {meal.productIds.map((id) => getProduct(id)?.name).filter(Boolean).join(' + ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-title"><span>Quick add</span></div>
            <div className="card-grid">
              {products.filter((p) => p.tags.includes('post-workout') || p.tags.includes('breakfast')).slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} onAdd={() => addToCart(p.id, p.name)} />
              ))}
            </div>
          </>
        )}

        {tab === 'shop' && (
          <>
            <div className="screen-header">
              <h1>Shop healthy</h1>
              <p>Supermarket, restaurants, supplements & more</p>
            </div>

            <div className="tabs">
              {SHOP_TABS.map((t) => (
                <button
                  key={t.id}
                  className={`tab ${shopCat === t.id ? 'active' : ''}`}
                  onClick={() => setShopCat(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="card-grid">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={() => addToCart(p.id, p.name)} />
              ))}
            </div>
          </>
        )}

        {tab === 'recipes' && (
          <>
            <div className="screen-header">
              <h1>Recipe → Cart</h1>
              <p>Pick a recipe, we build your supermarket basket</p>
            </div>

            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className={`recipe-card ${selectedRecipe === recipe.id ? 'selected' : ''}`}
                style={{ marginBottom: 12 }}
                onClick={() => setSelectedRecipe(recipe.id)}
              >
                <div className="recipe-hero">{recipe.image}</div>
                <div className="recipe-body">
                  <h3>{recipe.name}</h3>
                  <div className="recipe-meta">
                    <span className="pill">{recipe.time}</span>
                    <span className="pill green">{recipe.protein}g protein</span>
                    <span className="pill orange">{recipe.calories} cal</span>
                    {recipe.tags.map((t) => (
                      <span key={t} className="pill blue">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {activeRecipe && (
              <div className="card" style={{ marginTop: 16 }}>
                <h3 style={{ fontSize: 15, marginBottom: 4 }}>Ingredients for {activeRecipe.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                  {activeRecipe.servings} servings · adds to your supermarket cart
                </p>
                <div className="ingredient-list">
                  {activeRecipe.ingredients.map((ing) => {
                    const prod = getProduct(ing.productId);
                    return (
                      <div className="ingredient-row" key={ing.productId}>
                        <span>{prod?.image} {prod?.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {ing.amount} · {prod?.protein}g P · ${prod?.price.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginTop: 12,
                  padding: '10px 0', borderTop: '1px solid var(--border)', fontSize: 13,
                }}>
                  <span>Total macros (per serving)</span>
                  <strong style={{ color: 'var(--accent)' }}>
                    {activeRecipe.protein}g protein · {activeRecipe.calories} cal
                  </strong>
                </div>
                <button className="btn-primary" onClick={() => addRecipeToCart(activeRecipe.id)}>
                  Add all to cart
                </button>
              </div>
            )}
          </>
        )}

        {tab === 'plan' && (
          <>
            <div className="screen-header">
              <h1>Diet plan</h1>
              <p>{dietPlan.name}</p>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span>Daily average</span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  {dietPlan.dailyAvg.calories} cal · {dietPlan.dailyAvg.protein}g protein
                </span>
              </div>
              <div className="budget-bar">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                  <span>Weekly budget</span>
                  <span>${(dietPlan.dailyAvg.budget * 7).toFixed(0)} / ${userProfile.budget}</span>
                </div>
                <div className="budget-track">
                  <div className="budget-fill" style={{ width: '72%' }} />
                </div>
              </div>
            </div>

            <div className="section-title"><span>This week</span></div>
            {dietPlan.days.map((d) => (
              <div key={d.day} className={`plan-day ${d.gym ? 'gym' : ''}`}>
                <div className="plan-day-label">{d.day}</div>
                <div className="plan-day-meals">
                  {d.gym && <span className="pill green" style={{ marginBottom: 4 }}>🏋️ Gym</span>}
                  <div>{d.meals.join(' → ')}</div>
                </div>
                <button
                  onClick={() => showToast(`Added ${d.day} meals to cart`)}
                  style={{ color: 'var(--accent)', padding: 4 }}
                >
                  <Plus size={18} />
                </button>
              </div>
            ))}

            <button className="btn-primary" onClick={() => showToast('Full week added to cart — $86.50')}>
              Buy full week plan
            </button>
          </>
        )}

        {tab === 'coach' && (
          <>
            <div className="screen-header">
              <h1>AI Coach</h1>
              <p>Personalized meal & shopping advice</p>
            </div>

            <div className="quick-prompts">
              {['What should I eat pre-workout?', 'Am I hitting my protein?', 'Suggest a sweet snack', 'Plan under $15/day'].map((q) => (
                <button key={q} className="quick-prompt" onClick={() => sendChat(q)}>{q}</button>
              ))}
            </div>

            <div className="chat-container">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.role}`}>{msg.text}</div>
              ))}
              <div className="chat-input-row">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about meals, macros, budget..."
                  onKeyDown={(e) => e.key === 'Enter' && sendChat(chatInput)}
                />
                <button onClick={() => sendChat(chatInput)}><Send size={18} /></button>
              </div>
            </div>
          </>
        )}

        {tab === 'profile' && (
          <>
            <div className="screen-header">
              <h1>Health profile</h1>
              <p>Track progress & personalize your plan</p>
            </div>

            <div className="profile-stat-grid">
              <div className="stat-box">
                <div className="value">{userProfile.weight}kg</div>
                <div className="label">Current weight</div>
              </div>
              <div className="stat-box">
                <div className="value">{userProfile.targetWeight}kg</div>
                <div className="label">Target weight</div>
              </div>
              <div className="stat-box">
                <div className="value">{userProfile.bodyFat}%</div>
                <div className="label">Body fat</div>
              </div>
              <div className="stat-box">
                <div className="value">{userProfile.muscleMass}kg</div>
                <div className="label">Muscle mass</div>
              </div>
            </div>

            <div className="inbody-card">
              <h3>📊 InBody scan</h3>
              {inbodyUploaded ? (
                <div style={{ fontSize: 13, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={16} /> Scan uploaded — diet adjusted for lean bulk
                </div>
              ) : (
                <div className="upload-zone" onClick={() => { setInbodyUploaded(true); showToast('InBody scan uploaded'); }}>
                  <Upload size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
                  <div>Upload your InBody results</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>PDF or photo — we'll adjust your plan</div>
                </div>
              )}
            </div>

            <div className="section-title"><span>Kitchen inventory</span></div>
            {inventory.map((item) => (
              <div className="product-card" key={item.name} style={{ marginBottom: 8 }}>
                <div className="product-info">
                  <h4>{item.name}</h4>
                  <div className="meta">{item.qty} · expires {item.expires}</div>
                </div>
                <span className="pill">{item.expires.includes('day') ? '⚠️ soon' : '✓ ok'}</span>
              </div>
            ))}

            <div className="section-title"><span>Gym schedule</span></div>
            <div className="card">
              <div style={{ fontSize: 14 }}>
                <strong style={{ color: 'var(--accent)' }}>{userProfile.gymDays.join(', ')}</strong>
                <span style={{ color: 'var(--text-muted)' }}> at {userProfile.gymTime}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                Meals are timed around your sessions — pre-workout fuel at T-30min, post-workout protein within 45min.
              </p>
            </div>
          </>
        )}
      </div>

      <nav className="bottom-nav">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${tab === id ? 'active' : ''}`}
            onClick={() => setTab(id)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
