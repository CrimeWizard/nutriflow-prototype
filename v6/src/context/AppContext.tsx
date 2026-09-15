import {
  createContext, useCallback, useContext, useMemo, useState, type ReactNode,
} from 'react';
import type {
  CartItem, Order, Recipe, Restaurant, Screen, Tab, UserProfile,
} from '../types';
import type { DayKey, PlannedMeal, WeeklyPlan } from '../planning/types';
import { generateWeeklyPlan } from '../planning/generateWeeklyPlan';
import {
  buildDeliveryGroups, cartLineKey, cartTotal as sumCart,
  newCartLineId, parseGroupKey,
} from '../cartUtils';
import {
  findShopProduct, getDefaultProducts, getQuickMeal, getRecipe, getRestaurant,
  getSupermarket,
} from '../data/mockData';
import { generateOrderId, getTodayKey } from '../utils';

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
  ingredientRecipe: Recipe | null;
  ingredientSelections: Record<string, string>;
  lastOrder: Order | null;
  orderHistory: Order[];
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
  openRestaurant: (restaurant: Restaurant) => void;
  closeRestaurant: () => void;
  addMealToCart: (restaurant: Restaurant, mealId: string) => void;
  openIngredients: (recipe: Recipe) => void;
  closeIngredients: () => void;
  setIngredientSelection: (ingredientId: string, productId: string) => void;
  addIngredientsToCart: () => void;
  addPlannedMealsToCart: (dayKey: DayKey) => void;
  addPlannedMealToCart: (meal: PlannedMeal) => void;
  setSelectedPlanDay: (day: DayKey) => void;
  placeOrder: () => Order;
  setSelectedSupermarketId: (id: string) => void;
  cartTotal: number;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadOnboardingComplete(): boolean {
  try { return localStorage.getItem('nf-v6-onboarded') === 'true'; } catch { return false; }
}

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem('nf-v6-profile');
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch { /* empty */ }
  return DEFAULT_PROFILE;
}

function loadSupermarketId(): string {
  try {
    const id = localStorage.getItem('nf-v6-supermarket');
    if (id) return id;
  } catch { /* empty */ }
  return 'sm-carrefour';
}

function loadOrderHistory(): Order[] {
  try {
    const raw = localStorage.getItem('nf-v6-orders');
    if (raw) {
      const parsed = JSON.parse(raw) as Order[];
      return parsed.map((o) => ({ ...o, placedAt: new Date(o.placedAt) }));
    }
  } catch { /* empty */ }
  return [];
}

function saveOrderHistory(orders: Order[]) {
  try { localStorage.setItem('nf-v6-orders', JSON.stringify(orders)); } catch { /* empty */ }
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
  const [orderHistory, setOrderHistory] = useState<Order[]>(loadOrderHistory);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedSupermarketId, setSelectedSupermarketIdState] = useState(loadSupermarketId);
  const [selectedPlanDay, setSelectedPlanDay] = useState<DayKey>(getTodayKey());

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
    try { localStorage.setItem('nf-v6-supermarket', id); } catch { /* empty */ }
  }, []);

  const setProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem('nf-v6-profile', JSON.stringify(next)); } catch { /* empty */ }
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
    try { localStorage.setItem('nf-v6-onboarded', 'true'); } catch { /* empty */ }
    setScreen('home');
    setTab('home');
    setSelectedPlanDay(getTodayKey());
  }, []);

  const resetOnboarding = useCallback(() => {
    try {
      localStorage.removeItem('nf-v6-onboarded');
      localStorage.removeItem('nf-v6-profile');
      localStorage.removeItem('nf-v6-supermarket');
      localStorage.removeItem('nf-v6-orders');
    } catch { /* empty */ }
    setProfileState(DEFAULT_PROFILE);
    setOnboardingStep(0);
    setScreen('onboarding');
    setCart([]);
    setOrderHistory([]);
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
    const items: CartItemInput[] = ingredientRecipe.ingredients.map((ing) => {
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

  const placeOrder = useCallback(() => {
    const deliveries = buildDeliveryGroups(cart);
    const order: Order = {
      id: generateOrderId(),
      deliveries,
      total: sumCart(cart),
      placedAt: new Date(),
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

  const cartTotal = useMemo(() => sumCart(cart), [cart]);

  const value: AppContextValue = {
    screen, tab, profile, onboardingStep, cart,
    activeRestaurant, ingredientRecipe, ingredientSelections,
    lastOrder, orderHistory, toast, selectedSupermarketId,
    selectedPlanDay, weeklyPlan,
    setScreen, setTab, goTab, setProfile, setOnboardingStep,
    completeOnboarding, resetOnboarding, showToast, addToCart,
    removeCartLine, updateCartQuantity, removeCartGroup,
    openRestaurant, closeRestaurant, addMealToCart,
    openIngredients, closeIngredients, setIngredientSelection: (ingredientId, productId) => {
      setIngredientSelections((s) => ({ ...s, [ingredientId]: productId }));
    },
    addIngredientsToCart, addPlannedMealsToCart, addPlannedMealToCart,
    setSelectedPlanDay, placeOrder,
    setSelectedSupermarketId, cartTotal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
