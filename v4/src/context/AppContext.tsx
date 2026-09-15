import {
  createContext, useCallback, useContext, useMemo, useState, type ReactNode,
} from 'react';
import type {
  CartItem, Order, Recipe, Restaurant, Screen, Tab, UserProfile,
} from '../types';
import {
  getDefaultProducts, getRecipe, getRestaurant, getSupermarket, todayMeals,
} from '../data/mockData';
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
  activeRestaurant: Restaurant | null;
  ingredientRecipe: Recipe | null;
  ingredientSelections: Record<string, string>;
  lastOrder: Order | null;
  orderHistory: Order[];
  toast: string | null;
  selectedSupermarketId: string;
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
  openRestaurant: (restaurant: Restaurant) => void;
  closeRestaurant: () => void;
  addMealToCart: (restaurant: Restaurant, mealId: string) => void;
  openIngredients: (recipe: Recipe) => void;
  closeIngredients: () => void;
  setIngredientSelection: (ingredientId: string, productId: string) => void;
  addIngredientsToCart: () => void;
  addTodayMealsToCart: () => void;
  placeOrder: () => Order;
  setSelectedSupermarketId: (id: string) => void;
  cartTotal: number;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadOnboardingComplete(): boolean {
  try { return localStorage.getItem('nf-v4-onboarded') === 'true'; } catch { return false; }
}

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem('nf-v4-profile');
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch { /* empty */ }
  return DEFAULT_PROFILE;
}

function loadSupermarketId(): string {
  try {
    const id = localStorage.getItem('nf-v4-supermarket');
    if (id) return id;
  } catch { /* empty */ }
  return 'sm-carrefour';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const onboarded = loadOnboardingComplete();
  const [screen, setScreen] = useState<Screen>(onboarded ? 'home' : 'onboarding');
  const [tab, setTab] = useState<Tab>('home');
  const [profile, setProfileState] = useState<UserProfile>(loadProfile);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
  const [ingredientRecipe, setIngredientRecipe] = useState<Recipe | null>(null);
  const [ingredientSelections, setIngredientSelections] = useState<Record<string, string>>({});
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedSupermarketId, setSelectedSupermarketIdState] = useState(loadSupermarketId);

  const setSelectedSupermarketId = useCallback((id: string) => {
    setSelectedSupermarketIdState(id);
    try { localStorage.setItem('nf-v4-supermarket', id); } catch { /* empty */ }
  }, []);

  const supermarketName = getSupermarket(selectedSupermarketId)?.name ?? 'Carrefour';

  const setProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem('nf-v4-profile', JSON.stringify(next)); } catch { /* empty */ }
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
    setActiveRestaurant(null);
    setIngredientRecipe(null);
  }, []);

  const completeOnboarding = useCallback(() => {
    try { localStorage.setItem('nf-v4-onboarded', 'true'); } catch { /* empty */ }
    setScreen('home');
    setTab('home');
  }, []);

  const resetOnboarding = useCallback(() => {
    try {
      localStorage.removeItem('nf-v4-onboarded');
      localStorage.removeItem('nf-v4-profile');
    } catch { /* empty */ }
    setProfileState(DEFAULT_PROFILE);
    setOnboardingStep(0);
    setScreen('onboarding');
    setCart([]);
    setOrderHistory([]);
  }, []);

  const addToCart = useCallback((items: CartItem[]) => {
    setCart((c) => [...c, ...items]);
  }, []);

  const openRestaurant = useCallback((restaurant: Restaurant) => {
    setActiveRestaurant(restaurant);
    setScreen('restaurant-menu');
  }, []);

  const closeRestaurant = useCallback(() => {
    setActiveRestaurant(null);
    setScreen('restaurants');
    setTab('restaurants');
  }, []);

  const addMealToCart = useCallback((restaurant: Restaurant, mealId: string) => {
    const meal = restaurant.meals.find((m) => m.id === mealId);
    if (!meal) return;
    addToCart([{
      productId: meal.id,
      name: meal.name,
      price: meal.price,
      image: meal.image,
      source: 'restaurant',
      vendorName: restaurant.name,
    }]);
    showToast(`${meal.name} added from ${restaurant.name}`);
  }, [addToCart, showToast]);

  const openIngredients = useCallback((recipe: Recipe) => {
    const defaults: Record<string, string> = {};
    recipe.ingredients.forEach((ing) => { defaults[ing.id] = ing.defaultOptionId; });
    setIngredientSelections(defaults);
    setIngredientRecipe(recipe);
    setScreen('ingredients');
  }, []);

  const closeIngredients = useCallback(() => {
    setIngredientRecipe(null);
    setScreen('groceries');
    setTab('groceries');
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
        source: 'supermarket',
        vendorName: supermarketName,
        fromRecipe: ingredientRecipe.name,
      };
    });
    addToCart(items);
    showToast(`${ingredientRecipe.name} ingredients added`);
    setIngredientRecipe(null);
    setTab('cart');
    setScreen('cart');
  }, [ingredientRecipe, ingredientSelections, addToCart, showToast, supermarketName]);

  const addTodayMealsToCart = useCallback(() => {
    const items: CartItem[] = [];
    todayMeals.forEach((meal) => {
      if (meal.source === 'restaurant' && meal.restaurantId && meal.mealId) {
        const r = getRestaurant(meal.restaurantId);
        const m = r?.meals.find((x) => x.id === meal.mealId);
        if (r && m) {
          items.push({
            productId: m.id, name: m.name, price: m.price, image: m.image,
            source: 'restaurant', vendorName: r.name,
          });
        }
      }
      if (meal.source === 'recipe' && meal.recipeId) {
        const recipe = getRecipe(meal.recipeId);
        if (recipe) {
          getDefaultProducts(recipe).forEach((p) => {
            items.push({
              productId: p.id, brand: p.brand, name: p.name, size: p.size,
              price: p.price, image: p.image, source: 'supermarket',
              vendorName: supermarketName, fromRecipe: recipe.name,
            });
          });
        }
      }
    });
    addToCart(items);
    showToast("Today's meals added to cart");
    setTab('cart');
    setScreen('cart');
  }, [addToCart, showToast, supermarketName]);

  const placeOrder = useCallback(() => {
    const order: Order = {
      id: generateOrderId(),
      items: cart,
      total: cart.reduce((s, i) => s + i.price, 0),
      placedAt: new Date(),
      eta: 'Today, 45–60 min',
    };
    setLastOrder(order);
    setOrderHistory((h) => [order, ...h]);
    setCart([]);
    setScreen('order-success');
    return order;
  }, [cart]);

  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.price, 0), [cart]);

  const value: AppContextValue = {
    screen, tab, profile, onboardingStep, cart,
    activeRestaurant, ingredientRecipe, ingredientSelections,
    lastOrder, orderHistory, toast, selectedSupermarketId,
    setScreen, setTab, goTab, setProfile, setOnboardingStep,
    completeOnboarding, resetOnboarding, showToast, addToCart,
    openRestaurant, closeRestaurant, addMealToCart,
    openIngredients, closeIngredients, setIngredientSelection: (ingredientId, productId) => {
      setIngredientSelections((s) => ({ ...s, [ingredientId]: productId }));
    },
    addIngredientsToCart, addTodayMealsToCart, placeOrder,
    setSelectedSupermarketId, cartTotal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
