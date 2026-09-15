import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';
import type {
  CartItem, DeliveryGroup, Favorite, Order, Recipe, Restaurant, Screen, Tab, UserProfile,
} from '../types';
import { loadFavorites, saveFavorites } from '../lib/favorites';
import { reorderDelivery, reorderOrder } from '../lib/reorder';
import { defaultSelectionsForRecipe } from '../lib/recipeIngredients';
import type { DayKey, PlannedMeal, WeeklyPlan } from '../planning/types';
import { generateWeeklyPlan } from '../planning/generateWeeklyPlan';
import {
  buildDeliveryGroups, cartLineKey, cartTotal as sumCart,
  newCartLineId, parseGroupKey,
} from '../cartUtils';
import {
  findShopProduct, getDefaultProducts, getQuickMeal, getRecipe, getRestaurant,
  getShopProduct, getSupermarket,
} from '../data/mockData';
import { formatEgp, generateOrderId, getTodayKey } from '../utils';

type CartItemInput = Omit<CartItem, 'cartLineId' | 'quantity'>;

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  phone: '',
  area: 'New Cairo',
  address: '',
  gymDays: ['Mon', 'Wed', 'Fri'],
  gymTime: '18:00',
  goal: 'maintain',
  shoppingMode: 'mix',
  budgetTier: 'moderate',
};

interface AppState {
  screen: Screen;
  tab: Tab;
  profile: UserProfile;
  onboardingStep: number;
  cart: CartItem[];
  activeRestaurant: Restaurant | null;
  highlightedMealId: string | null;
  ingredientRecipe: Recipe | null;
  ingredientSelections: Record<string, string>;
  lastOrder: Order | null;
  orderHistory: Order[];
  favorites: Favorite[];
  toast: string | null;
  selectedSupermarketId: string;
  selectedPlanDay: DayKey;
  weeklyPlan: WeeklyPlan;
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
  addToCart: (items: CartItemInput[]) => void;
  removeCartLine: (cartLineId: string) => void;
  updateCartQuantity: (cartLineId: string, quantity: number) => void;
  removeCartGroup: (groupKey: string) => void;
  openRestaurant: (restaurant: Restaurant, mealId?: string) => void;
  closeRestaurant: () => void;
  addShopProductToCart: (productId: string) => boolean;
  addMealToCart: (restaurant: Restaurant, mealId: string) => void;
  openIngredients: (recipe: Recipe) => void;
  closeIngredients: () => void;
  setIngredientSelection: (ingredientId: string, productId: string) => void;
  addIngredientsToCart: () => void;
  addPlannedMealsToCart: (dayKey: DayKey) => void;
  addPlannedWeekToCart: () => void;
  addPlannedMealToCart: (meal: PlannedMeal) => void;
  setSelectedPlanDay: (day: DayKey) => void;
  placeOrder: () => Order;
  markOrderDelivered: (orderId: string) => void;
  reorderFromDelivery: (delivery: DeliveryGroup) => void;
  reorderFromOrder: (order: Order) => void;
  isFavorite: (key: string) => boolean;
  toggleFavorite: (favorite: Favorite) => void;
  setSelectedSupermarketId: (id: string) => void;
  cartTotal: number;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadOnboardingComplete(): boolean {
  try { return localStorage.getItem('nf-v7-onboarded') === 'true'; } catch { return false; }
}

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem('nf-v7-profile');
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch { /* empty */ }
  return DEFAULT_PROFILE;
}

function loadSupermarketId(): string {
  try {
    const id = localStorage.getItem('nf-v7-supermarket');
    if (id) return id;
  } catch { /* empty */ }
  return 'sm-carrefour';
}

function loadOrderHistory(): Order[] {
  try {
    const raw = localStorage.getItem('nf-v7-orders');
    if (raw) {
      const parsed = JSON.parse(raw) as Order[];
      return parsed.map((o) => ({
        ...o,
        placedAt: new Date(o.placedAt),
        status: o.status ?? 'active',
      }));
    }
  } catch { /* empty */ }
  return [];
}

function saveOrderHistory(orders: Order[]) {
  try { localStorage.setItem('nf-v7-orders', JSON.stringify(orders)); } catch { /* empty */ }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const onboarded = loadOnboardingComplete();
  const [screen, setScreen] = useState<Screen>(onboarded ? 'home' : 'onboarding');
  const [tab, setTab] = useState<Tab>('home');
  const [profile, setProfileState] = useState<UserProfile>(loadProfile);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
  const [highlightedMealId, setHighlightedMealId] = useState<string | null>(null);
  const [ingredientRecipe, setIngredientRecipe] = useState<Recipe | null>(null);
  const [ingredientSelections, setIngredientSelections] = useState<Record<string, string>>({});
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>(loadOrderHistory);
  const [favorites, setFavorites] = useState<Favorite[]>(loadFavorites);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedSupermarketId, setSelectedSupermarketIdState] = useState(loadSupermarketId);
  const [selectedPlanDay, setSelectedPlanDay] = useState<DayKey>(getTodayKey());

  const DEMO_AUTO_DELIVER_MS = 90_000;

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      setOrderHistory((h) => {
        let changed = false;
        const next = h.map((o) => {
          if (o.status !== 'active') return o;
          const age = now - new Date(o.placedAt).getTime();
          if (age >= DEMO_AUTO_DELIVER_MS) {
            changed = true;
            return { ...o, status: 'delivered' as const, deliveredAt: new Date().toISOString() };
          }
          return o;
        });
        if (changed) saveOrderHistory(next);
        return changed ? next : h;
      });
    };
    const id = window.setInterval(tick, 5000);
    tick();
    return () => window.clearInterval(id);
  }, []);

  const weeklyPlan = useMemo(
    () => generateWeeklyPlan({
      goal: profile.goal,
      gymDays: profile.gymDays,
      gymTime: profile.gymTime,
      area: profile.area,
      budgetTier: profile.budgetTier,
      shoppingMode: profile.shoppingMode,
    }),
    [profile.goal, profile.gymDays, profile.gymTime, profile.area, profile.budgetTier, profile.shoppingMode],
  );

  const supermarketName = getSupermarket(selectedSupermarketId)?.name ?? 'Carrefour';

  const setSelectedSupermarketId = useCallback((id: string) => {
    setSelectedSupermarketIdState(id);
    try { localStorage.setItem('nf-v7-supermarket', id); } catch { /* empty */ }
  }, []);

  const setProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem('nf-v7-profile', JSON.stringify(next)); } catch { /* empty */ }
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
    try { localStorage.setItem('nf-v7-onboarded', 'true'); } catch { /* empty */ }
    setScreen('home');
    setTab('home');
    setSelectedPlanDay(getTodayKey());
  }, []);

  const resetOnboarding = useCallback(() => {
    try {
      localStorage.removeItem('nf-v7-onboarded');
      localStorage.removeItem('nf-v7-profile');
      localStorage.removeItem('nf-v7-supermarket');
      localStorage.removeItem('nf-v7-orders');
      localStorage.removeItem('nf-v7-favorites');
    } catch { /* empty */ }
    setProfileState(DEFAULT_PROFILE);
    setOnboardingStep(0);
    setScreen('onboarding');
    setCart([]);
    setOrderHistory([]);
    setFavorites([]);
    setSelectedPlanDay(getTodayKey());
  }, []);

  const addToCart = useCallback((items: CartItemInput[]) => {
    setCart((prev) => {
      const next = [...prev];
      items.forEach((item) => {
        const key = cartLineKey(item);
        const idx = next.findIndex((l) => cartLineKey(l) === key);
        if (idx >= 0) {
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        } else {
          next.push({ ...item, cartLineId: newCartLineId(), quantity: 1 });
        }
      });
      return next;
    });
  }, []);

  const removeCartLine = useCallback((cartLineId: string) => {
    setCart((c) => c.filter((i) => i.cartLineId !== cartLineId));
  }, []);

  const updateCartQuantity = useCallback((cartLineId: string, quantity: number) => {
    if (quantity < 1) {
      removeCartLine(cartLineId);
      return;
    }
    setCart((c) => c.map((i) => (i.cartLineId === cartLineId ? { ...i, quantity } : i)));
  }, [removeCartLine]);

  const removeCartGroup = useCallback((groupKey: string) => {
    const { source, vendorName } = parseGroupKey(groupKey);
    setCart((c) => c.filter((i) => !(i.source === source && i.vendorName === vendorName)));
    showToast(`Removed ${vendorName} from cart`);
  }, [showToast]);

  const openRestaurant = useCallback((restaurant: Restaurant, mealId?: string) => {
    setActiveRestaurant(restaurant);
    setHighlightedMealId(mealId ?? null);
    setScreen('restaurant-menu');
  }, []);

  const closeRestaurant = useCallback(() => {
    setActiveRestaurant(null);
    setHighlightedMealId(null);
    setScreen('restaurants');
    setTab('restaurants');
  }, []);

  const addShopProductToCart = useCallback((productId: string) => {
    const p = getShopProduct(selectedSupermarketId, productId);
    const sm = getSupermarket(selectedSupermarketId);
    if (!p || !sm) return false;
    addToCart([{
      productId: p.id,
      brand: p.brand,
      name: p.name,
      size: p.size,
      price: p.price,
      image: p.image,
      source: 'supermarket',
      vendorName: sm.name,
    }]);
    showToast(`Added ${p.brand} ${p.name}`);
    return true;
  }, [selectedSupermarketId, addToCart, showToast]);

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
    setIngredientSelections(defaultSelectionsForRecipe(recipe, selectedSupermarketId));
    setIngredientRecipe(recipe);
    setScreen('ingredients');
  }, [selectedSupermarketId]);

  const closeIngredients = useCallback(() => {
    setIngredientRecipe(null);
    setScreen('groceries');
    setTab('groceries');
  }, []);

  const addIngredientsToCart = useCallback(() => {
    if (!ingredientRecipe) return;
    const items: CartItemInput[] = [];
    ingredientRecipe.ingredients.forEach((ing) => {
      const id = ingredientSelections[ing.id] ?? ing.defaultOptionId;
      const opt = ing.options.find((o) => o.id === id)!;
      const p = findShopProduct(selectedSupermarketId, opt.brand, opt.name);
      if (!p) return;
      items.push({
        productId: p.id,
        brand: p.brand,
        name: p.name,
        size: p.size,
        price: p.price,
        image: p.image,
        source: 'supermarket',
        vendorName: supermarketName,
        fromRecipe: ingredientRecipe.name,
      });
    });
    addToCart(items);
    showToast(`${ingredientRecipe.name} ingredients added`);
    setIngredientRecipe(null);
    setTab('cart');
    setScreen('cart');
  }, [ingredientRecipe, ingredientSelections, addToCart, showToast, supermarketName, selectedSupermarketId]);

  const plannedMealToCartItems = useCallback((meal: PlannedMeal): CartItemInput[] => {
    if (meal.source === 'restaurant' && meal.restaurantId && meal.mealId) {
      const r = getRestaurant(meal.restaurantId);
      const m = r?.meals.find((x) => x.id === meal.mealId);
      if (r && m) {
        return [{
          productId: m.id, name: m.name, price: m.price, image: m.image,
          source: 'restaurant', vendorName: r.name,
        }];
      }
    }
    if (meal.source === 'recipe' && meal.recipeId) {
      const recipe = getRecipe(meal.recipeId);
      if (recipe) {
        return getDefaultProducts(recipe).map((p) => ({
          productId: p.id, brand: p.brand, name: p.name, size: p.size,
          price: p.price, image: p.image, source: 'supermarket',
          vendorName: supermarketName, fromRecipe: recipe.name,
        }));
      }
    }
    if (meal.source === 'quick' && meal.quickMealId) {
      const quick = getQuickMeal(meal.quickMealId);
      if (!quick) return [];
      const items: CartItemInput[] = [];
      quick.matchers.forEach((matcher) => {
        if (matcher.restaurantId && matcher.restaurantMealId) {
          const r = getRestaurant(matcher.restaurantId);
          const m = r?.meals.find((x) => x.id === matcher.restaurantMealId);
          if (r && m) {
            items.push({
              productId: m.id, name: m.name, price: m.price, image: m.image,
              source: 'restaurant', vendorName: r.name,
            });
          }
          return;
        }
        const p = findShopProduct(selectedSupermarketId, matcher.brand, matcher.name);
        if (p) {
          items.push({
            productId: p.id, brand: p.brand, name: p.name, size: p.size,
            price: p.price, image: p.image, source: 'supermarket',
            vendorName: supermarketName,
          });
        }
      });
      return items;
    }
    return [];
  }, [supermarketName, selectedSupermarketId]);

  const addPlannedMealToCart = useCallback((meal: PlannedMeal) => {
    const items = plannedMealToCartItems(meal);
    if (items.length === 0) return;
    addToCart(items);
    showToast(`${meal.title} added to cart`);
  }, [plannedMealToCartItems, addToCart, showToast]);

  const addPlannedMealsToCart = useCallback((dayKey: DayKey) => {
    const day = weeklyPlan.days.find((d) => d.dayKey === dayKey);
    if (!day) return;
    const items: CartItemInput[] = [];
    day.meals.forEach((meal) => {
      items.push(...plannedMealToCartItems(meal));
    });
    if (items.length === 0) return;
    addToCart(items);
    showToast(`${dayKey}'s meals added to cart`);
    setTab('cart');
    setScreen('cart');
  }, [weeklyPlan, plannedMealToCartItems, addToCart, showToast]);

  const addPlannedWeekToCart = useCallback(() => {
    const items: CartItemInput[] = [];
    weeklyPlan.days.forEach((day) => {
      day.meals.forEach((meal) => {
        items.push(...plannedMealToCartItems(meal));
      });
    });
    if (items.length === 0) return;
    const weekTotal = weeklyPlan.days.reduce((s, d) => s + d.dayTotal, 0);
    addToCart(items);
    showToast(`Your week added · ~${formatEgp(weekTotal)} · review cart before checkout`);
    setTab('cart');
    setScreen('cart');
  }, [weeklyPlan, plannedMealToCartItems, addToCart, showToast]);

  const placeOrder = useCallback(() => {
    const deliveries = buildDeliveryGroups(cart);
    const order: Order = {
      id: generateOrderId(),
      deliveries,
      total: sumCart(cart),
      placedAt: new Date(),
      status: 'active',
    };
    setLastOrder(order);
    setOrderHistory((h) => {
      const next = [order, ...h];
      saveOrderHistory(next);
      return next;
    });
    setCart([]);
    setScreen('order-success');
    return order;
  }, [cart]);

  const markOrderDelivered = useCallback((orderId: string) => {
    setOrderHistory((h) => {
      const next = h.map((o) => (
        o.id === orderId
          ? { ...o, status: 'delivered' as const, deliveredAt: new Date().toISOString() }
          : o
      ));
      saveOrderHistory(next);
      return next;
    });
    showToast('Order marked delivered');
  }, [showToast]);

  const reorderFromDelivery = useCallback((delivery: DeliveryGroup) => {
    const items = reorderDelivery(delivery);
    if (items.length === 0) return;
    addToCart(items);
    showToast(`Reordered from ${delivery.vendorName}`);
    setTab('cart');
    setScreen('cart');
  }, [addToCart, showToast]);

  const reorderFromOrder = useCallback((order: Order) => {
    const items = reorderOrder(order.deliveries);
    if (items.length === 0) return;
    addToCart(items);
    showToast('Full order added to cart');
    setTab('cart');
    setScreen('cart');
  }, [addToCart, showToast]);

  const isFavorite = useCallback(
    (key: string) => favorites.some((f) => f.key === key),
    [favorites],
  );

  const toggleFavorite = useCallback((favorite: Favorite) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.key === favorite.key);
      const next = exists ? prev.filter((f) => f.key !== favorite.key) : [...prev, favorite];
      saveFavorites(next);
      showToast(exists ? 'Removed from favorites' : 'Saved to favorites');
      return next;
    });
  }, [showToast]);

  const cartTotal = useMemo(() => sumCart(cart), [cart]);

  const value: AppContextValue = {
    screen, tab, profile, onboardingStep, cart,
    activeRestaurant, highlightedMealId, ingredientRecipe, ingredientSelections,
    lastOrder, orderHistory, favorites, toast, selectedSupermarketId,
    selectedPlanDay, weeklyPlan,
    setScreen, setTab, goTab, setProfile, setOnboardingStep,
    completeOnboarding, resetOnboarding, showToast, addToCart,
    removeCartLine, updateCartQuantity, removeCartGroup,
    openRestaurant, closeRestaurant, addMealToCart, addShopProductToCart,
    openIngredients, closeIngredients, setIngredientSelection: (ingredientId, productId) => {
      setIngredientSelections((s) => ({ ...s, [ingredientId]: productId }));
    },
    addIngredientsToCart, addPlannedMealsToCart, addPlannedWeekToCart, addPlannedMealToCart,
    setSelectedPlanDay, placeOrder, markOrderDelivered,
    reorderFromDelivery, reorderFromOrder, isFavorite, toggleFavorite,
    setSelectedSupermarketId, cartTotal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
