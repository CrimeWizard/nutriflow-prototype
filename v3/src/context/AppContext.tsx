import {
  createContext, useCallback, useContext, useMemo, useState, type ReactNode,
} from 'react';
import type {
  CartItem, Order, Recipe, Screen, Tab, UserProfile,
} from '../types';
import { getDefaultProducts, getRecipe, todayMeals } from '../data/mockData';
import { generateOrderId } from '../utils';

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  phone: '',
  area: 'New Cairo',
  address: '',
  gymDays: ['Mon', 'Wed', 'Fri'],
  gymTime: '18:00',
  goal: 'maintain',
};

interface AppState {
  screen: Screen;
  tab: Tab;
  profile: UserProfile;
  onboardingStep: number;
  cart: CartItem[];
  ingredientRecipe: Recipe | null;
  ingredientSelections: Record<string, string>;
  lastOrder: Order | null;
  toast: string | null;
}

interface AppContextValue extends AppState {
  setScreen: (screen: Screen) => void;
  setTab: (tab: Tab) => void;
  goTab: (tab: Tab) => void;
  setProfile: (patch: Partial<UserProfile>) => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  showToast: (msg: string) => void;
  addToCart: (items: CartItem[]) => void;
  clearCart: () => void;
  openIngredients: (recipe: Recipe) => void;
  closeIngredients: () => void;
  setIngredientSelection: (ingredientId: string, productId: string) => void;
  addIngredientsToCart: () => void;
  addTodayMealsToCart: () => void;
  placeOrder: () => Order;
  cartTotal: number;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadOnboardingComplete(): boolean {
  try {
    return localStorage.getItem('nf-v3-onboarded') === 'true';
  } catch {
    return false;
  }
}

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem('nf-v3-profile');
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch { /* empty */ }
  return DEFAULT_PROFILE;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const onboarded = loadOnboardingComplete();
  const [screen, setScreen] = useState<Screen>(onboarded ? 'home' : 'onboarding');
  const [tab, setTab] = useState<Tab>('home');
  const [profile, setProfileState] = useState<UserProfile>(loadProfile);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ingredientRecipe, setIngredientRecipe] = useState<Recipe | null>(null);
  const [ingredientSelections, setIngredientSelections] = useState<Record<string, string>>({});
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const setProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem('nf-v3-profile', JSON.stringify(next)); } catch { /* empty */ }
      return next;
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }, []);

  const goTab = useCallback((t: Tab) => {
    setTab(t);
    setScreen(t);
    setIngredientRecipe(null);
  }, []);

  const completeOnboarding = useCallback(() => {
    try { localStorage.setItem('nf-v3-onboarded', 'true'); } catch { /* empty */ }
    setScreen('home');
    setTab('home');
  }, []);

  const resetOnboarding = useCallback(() => {
    try {
      localStorage.removeItem('nf-v3-onboarded');
      localStorage.removeItem('nf-v3-profile');
    } catch { /* empty */ }
    setProfileState(DEFAULT_PROFILE);
    setOnboardingStep(0);
    setScreen('onboarding');
    setCart([]);
  }, []);

  const addToCart = useCallback((items: CartItem[]) => {
    setCart((c) => [...c, ...items]);
  }, []);

  const openIngredients = useCallback((recipe: Recipe) => {
    const defaults: Record<string, string> = {};
    recipe.ingredients.forEach((ing) => {
      defaults[ing.id] = ing.defaultOptionId;
    });
    setIngredientSelections(defaults);
    setIngredientRecipe(recipe);
    setScreen('ingredients');
  }, []);

  const closeIngredients = useCallback(() => {
    setIngredientRecipe(null);
    setScreen('recipes');
    setTab('recipes');
  }, []);

  const addIngredientsToCart = useCallback(() => {
    if (!ingredientRecipe) return;
    const items: CartItem[] = ingredientRecipe.ingredients.map((ing) => {
      const id = ingredientSelections[ing.id] ?? ing.defaultOptionId;
      const p = ing.options.find((o) => o.id === id)!;
      return {
        productId: p.id,
        brand: p.brand,
        name: p.name,
        size: p.size,
        price: p.price,
        image: p.image,
        fromRecipe: ingredientRecipe.name,
      };
    });
    addToCart(items);
    showToast(`${ingredientRecipe.name} added to cart`);
    setIngredientRecipe(null);
    setTab('cart');
    setScreen('cart');
  }, [ingredientRecipe, ingredientSelections, addToCart, showToast]);

  const addTodayMealsToCart = useCallback(() => {
    const recipeIds = [...new Set(todayMeals.filter((m) => m.recipeId).map((m) => m.recipeId!))];
    const items: CartItem[] = [];
    recipeIds.forEach((rid) => {
      const recipe = getRecipe(rid);
      if (!recipe) return;
      getDefaultProducts(recipe).forEach((p) => {
        items.push({
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
    addToCart(items);
    showToast("Today's meals added to cart");
    setTab('cart');
    setScreen('cart');
  }, [addToCart, showToast]);

  const placeOrder = useCallback(() => {
    const order: Order = {
      id: generateOrderId(),
      items: cart,
      total: cart.reduce((s, i) => s + i.price, 0),
      placedAt: new Date(),
      eta: 'Today, 45–60 min',
    };
    setLastOrder(order);
    setCart([]);
    setScreen('order-success');
    return order;
  }, [cart]);

  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.price, 0), [cart]);

  const value: AppContextValue = {
    screen,
    tab,
    profile,
    onboardingStep,
    cart,
    ingredientRecipe,
    ingredientSelections,
    lastOrder,
    toast,
    setScreen,
    setTab,
    goTab,
    setProfile,
    setOnboardingStep,
    completeOnboarding,
    resetOnboarding,
    showToast,
    addToCart,
    clearCart: () => setCart([]),
    openIngredients,
    closeIngredients,
    setIngredientSelection: (ingredientId, productId) => {
      setIngredientSelections((s) => ({ ...s, [ingredientId]: productId }));
    },
    addIngredientsToCart,
    addTodayMealsToCart,
    placeOrder,
    cartTotal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
