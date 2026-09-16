import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode,
} from 'react';
import type {
  CartItem, DeliveryGroup, Favorite, Order, Recipe, Restaurant, Screen, Tab, UserProfile,
} from '../types';
import { loadFavorites, saveFavorites } from '../lib/favorites';
import { reorderDelivery, reorderOrder } from '../lib/reorder';
import { defaultSelectionsForRecipe } from '../lib/recipeIngredients';
import type { DayKey, MealSlotId, PlannedMeal, WeeklyPlan } from '../planning/types';
import { generateWeeklyPlan } from '../planning/generateWeeklyPlan';
import {
  applyPlanOverrides, loadPlanOverrides, mealPlanKey, savePlanOverrides, type PlanOverrides,
} from '../lib/planOverrides';
import { cartCostForDayMeals } from '../lib/planPricing';
import {
  buildDeliveryGroups, cartLineKey, cartTotal as sumCart,
  newCartLineId, parseGroupKey,
} from '../cartUtils';
import {
  findShopProduct, getDefaultProducts, getRecipe, getRestaurant,
  getShopProduct, getSupermarket,
} from '../data/mockData';
import { summarizePlanBudget } from '../lib/planBudget';
import { resolveQuickMeal, type ResolvedQuickMeal } from '../lib/quickMealResolve';
import { formatEgp, generateOrderId, getTodayKey } from '../utils';

interface QuickMealPreviewState {
  title: string;
  resolved: ResolvedQuickMeal;
}

type CartItemInput = Omit<CartItem, 'cartLineId' | 'quantity'>;

interface NavSnapshot {
  screen: Screen;
  tab: Tab;
}

const TAB_SCREENS: Tab[] = ['home', 'cook-at-home', 'orders', 'today-plan', 'profile'];

function tabForScreen(screen: Screen, fallback: Tab): Tab {
  return TAB_SCREENS.includes(screen as Tab) ? (screen as Tab) : fallback;
}

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
  ingredientIncluded: Record<string, boolean>;
  lastOrder: Order | null;
  orderHistory: Order[];
  favorites: Favorite[];
  toast: string | null;
  selectedSupermarketId: string;
  selectedPlanDay: DayKey;
  weeklyPlan: WeeklyPlan;
  planOverrides: PlanOverrides;
  quickMealPreview: QuickMealPreviewState | null;
}

interface AppContextValue extends AppState {
  setScreen: (screen: Screen) => void;
  goBack: () => void;
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
  toggleIngredientIncluded: (ingredientId: string) => void;
  addIngredientsToCart: () => void;
  addPlannedMealsToCart: (dayKey: DayKey) => void;
  addPlannedWeekToCart: () => void;
  addPlannedMealToCart: (meal: PlannedMeal) => void;
  setSelectedPlanDay: (day: DayKey) => void;
  togglePlanMealSkipped: (dayKey: DayKey, slotId: MealSlotId) => void;
  togglePlanDaySkipped: (dayKey: DayKey) => void;
  swapPlanMeal: (dayKey: DayKey, slotId: MealSlotId, meal: PlannedMeal) => void;
  placeOrder: () => Order;
  markOrderDelivered: (orderId: string) => void;
  reorderFromDelivery: (delivery: DeliveryGroup) => void;
  reorderFromOrder: (order: Order) => void;
  isFavorite: (key: string) => boolean;
  toggleFavorite: (favorite: Favorite) => void;
  openFavorite: (favorite: Favorite) => void;
  setSelectedSupermarketId: (id: string) => void;
  setRecipeSupermarket: (id: string) => void;
  openQuickMealPreview: (meal: PlannedMeal) => void;
  closeQuickMealPreview: () => void;
  confirmQuickMealAdd: () => void;
  cartTotal: number;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadOnboardingComplete(): boolean {
  try { return localStorage.getItem('nf-v11-onboarded') === 'true'; } catch { return false; }
}

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem('nf-v11-profile');
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch { /* empty */ }
  return DEFAULT_PROFILE;
}

function loadSupermarketId(): string {
  try {
    const id = localStorage.getItem('nf-v11-supermarket');
    if (id) return id;
  } catch { /* empty */ }
  return 'sm-carrefour';
}

function loadOrderHistory(): Order[] {
  try {
    const raw = localStorage.getItem('nf-v11-orders');
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
  try { localStorage.setItem('nf-v11-orders', JSON.stringify(orders)); } catch { /* empty */ }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const onboarded = loadOnboardingComplete();
  const [screen, setScreenState] = useState<Screen>(onboarded ? 'home' : 'onboarding');
  const [tab, setTab] = useState<Tab>('home');
  const [profile, setProfileState] = useState<UserProfile>(loadProfile);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
  const [highlightedMealId, setHighlightedMealId] = useState<string | null>(null);
  const [ingredientRecipe, setIngredientRecipe] = useState<Recipe | null>(null);
  const [ingredientSelections, setIngredientSelections] = useState<Record<string, string>>({});
  const [ingredientIncluded, setIngredientIncluded] = useState<Record<string, boolean>>({});
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>(loadOrderHistory);
  const [favorites, setFavorites] = useState<Favorite[]>(loadFavorites);
  const [quickMealPreview, setQuickMealPreview] = useState<QuickMealPreviewState | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedSupermarketId, setSelectedSupermarketIdState] = useState(loadSupermarketId);
  const [selectedPlanDay, setSelectedPlanDay] = useState<DayKey>(getTodayKey());
  const [planOverrides, setPlanOverrides] = useState<PlanOverrides>(loadPlanOverrides);

  const screenRef = useRef(screen);
  const tabRef = useRef(tab);
  const restaurantReturnRef = useRef<NavSnapshot | null>(null);
  const ingredientsReturnRef = useRef<NavSnapshot | null>(null);
  const navStackRef = useRef<NavSnapshot[]>([]);

  useEffect(() => {
    screenRef.current = screen;
    tabRef.current = tab;
  }, [screen, tab]);

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

  const baseWeeklyPlan = useMemo(
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

  const weeklyPlan = useMemo(
    () => applyPlanOverrides(baseWeeklyPlan, planOverrides),
    [baseWeeklyPlan, planOverrides],
  );

  const updatePlanOverrides = useCallback((updater: (prev: PlanOverrides) => PlanOverrides) => {
    setPlanOverrides((prev) => {
      const next = updater(prev);
      savePlanOverrides(next);
      return next;
    });
  }, []);

  const togglePlanMealSkipped = useCallback((dayKey: DayKey, slotId: MealSlotId) => {
    const key = mealPlanKey(dayKey, slotId);
    updatePlanOverrides((prev) => {
      const skipped = new Set(prev.skippedMeals);
      if (skipped.has(key)) skipped.delete(key);
      else skipped.add(key);
      return { ...prev, skippedMeals: [...skipped] };
    });
  }, [updatePlanOverrides]);

  const togglePlanDaySkipped = useCallback((dayKey: DayKey) => {
    updatePlanOverrides((prev) => {
      const skipped = new Set(prev.skippedDays);
      if (skipped.has(dayKey)) skipped.delete(dayKey);
      else skipped.add(dayKey);
      return { ...prev, skippedDays: [...skipped] };
    });
  }, [updatePlanOverrides]);

  const supermarketName = getSupermarket(selectedSupermarketId)?.name ?? 'Carrefour';

  const setSelectedSupermarketId = useCallback((id: string) => {
    setSelectedSupermarketIdState(id);
    try { localStorage.setItem('nf-v11-supermarket', id); } catch { /* empty */ }
  }, []);

  const setRecipeSupermarket = useCallback((id: string) => {
    setSelectedSupermarketId(id);
    if (ingredientRecipe) {
      setIngredientSelections(defaultSelectionsForRecipe(ingredientRecipe, id));
    }
  }, [ingredientRecipe, setSelectedSupermarketId]);

  const setProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem('nf-v11-profile', JSON.stringify(next)); } catch { /* empty */ }
      return next;
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }, []);

  const swapPlanMeal = useCallback((dayKey: DayKey, slotId: MealSlotId, meal: PlannedMeal) => {
    const key = mealPlanKey(dayKey, slotId);
    updatePlanOverrides((prev) => ({
      ...prev,
      replacements: { ...prev.replacements, [key]: { ...meal, planSkipped: false } },
      skippedMeals: prev.skippedMeals.filter((item) => item !== key),
    }));
    showToast(`Swapped to ${meal.title}`);
  }, [updatePlanOverrides, showToast]);

  const navigateScreen = useCallback((target: Screen) => {
    if (target !== screenRef.current) {
      navStackRef.current.push({ screen: screenRef.current, tab: tabRef.current });
    }
    if (TAB_SCREENS.includes(target as Tab)) {
      setTab(target as Tab);
    }
    setScreenState(target);
  }, []);

  const goBack = useCallback(() => {
    const prev = navStackRef.current.pop();
    if (!prev) {
      setTab('home');
      setScreenState('home');
      return;
    }
    setTab(prev.tab);
    setScreenState(prev.screen);
  }, []);

  const goTab = useCallback((t: Tab) => {
    navStackRef.current = [];
    setTab(t);
    setScreenState(t);
    setActiveRestaurant(null);
    setIngredientRecipe(null);
  }, []);

  const completeOnboarding = useCallback(() => {
    try { localStorage.setItem('nf-v11-onboarded', 'true'); } catch { /* empty */ }
    navStackRef.current = [];
    setScreenState('home');
    setTab('home');
    setSelectedPlanDay(getTodayKey());
  }, []);

  const resetOnboarding = useCallback(() => {
    try {
      localStorage.removeItem('nf-v11-onboarded');
      localStorage.removeItem('nf-v11-profile');
      localStorage.removeItem('nf-v11-supermarket');
      localStorage.removeItem('nf-v11-orders');
      localStorage.removeItem('nf-v11-favorites');
      localStorage.removeItem('nf-v11-plan-overrides');
    } catch { /* empty */ }
    setProfileState(DEFAULT_PROFILE);
    setPlanOverrides({ skippedMeals: [], skippedDays: [], replacements: {} });
    setOnboardingStep(0);
    navStackRef.current = [];
    setScreenState('onboarding');
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
    if (restaurant.area !== profile.area) {
      showToast(`${restaurant.name} doesn't deliver to ${profile.area}`);
      return;
    }
    restaurantReturnRef.current = {
      screen: screenRef.current,
      tab: tabRef.current,
    };
    setActiveRestaurant(restaurant);
    setHighlightedMealId(mealId ?? null);
    setScreenState('restaurant-menu');
  }, [profile.area, showToast]);

  const closeRestaurant = useCallback(() => {
    const dest = restaurantReturnRef.current ?? { screen: 'restaurants' as Screen, tab: tabRef.current };
    restaurantReturnRef.current = null;
    setActiveRestaurant(null);
    setHighlightedMealId(null);
    setTab(tabForScreen(dest.screen, dest.tab));
    setScreenState(dest.screen);
  }, []);

  const addShopProductToCart = useCallback((productId: string) => {
    const p = getShopProduct(selectedSupermarketId, productId);
    const sm = getSupermarket(selectedSupermarketId);
    if (!p || !sm) {
      showToast(`Not available at ${sm?.name ?? getSupermarket(selectedSupermarketId)?.name ?? 'this store'}`);
      return false;
    }
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
    if (!meal) {
      showToast('This meal is no longer on the menu.');
      return;
    }
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
    ingredientsReturnRef.current = {
      screen: screenRef.current,
      tab: tabRef.current,
    };
    setIngredientSelections(defaultSelectionsForRecipe(recipe, selectedSupermarketId));
    setIngredientIncluded(Object.fromEntries(recipe.ingredients.map((ing) => [ing.id, true])));
    setIngredientRecipe(recipe);
    setScreenState('ingredients');
  }, [selectedSupermarketId]);

  const closeIngredients = useCallback(() => {
    const dest = ingredientsReturnRef.current ?? { screen: 'cook-at-home' as Screen, tab: 'cook-at-home' as Tab };
    ingredientsReturnRef.current = null;
    setIngredientRecipe(null);
    setIngredientIncluded({});
    setTab(tabForScreen(dest.screen, dest.tab));
    setScreenState(dest.screen);
  }, []);

  const addIngredientsToCart = useCallback(() => {
    if (!ingredientRecipe) return;
    const items: CartItemInput[] = [];
    const skipped: string[] = [];
    ingredientRecipe.ingredients.forEach((ing) => {
      if (ingredientIncluded[ing.id] === false) return;
      const id = ingredientSelections[ing.id] ?? ing.defaultOptionId;
      const opt = ing.options.find((o) => o.id === id)!;
      const p = findShopProduct(selectedSupermarketId, opt.brand, opt.name);
      if (!p) {
        skipped.push(ing.name);
        return;
      }
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
    if (items.length === 0) {
      showToast(`No ingredients available at ${supermarketName}. Try another supermarket.`);
      return;
    }
    addToCart(items);
    if (skipped.length > 0) {
      showToast(`Added ${items.length} — ${skipped.join(', ')} not at ${supermarketName}`);
    } else {
      showToast(`${items.length} ${items.length === 1 ? 'ingredient' : 'ingredients'} added`);
    }
    const returnTo = ingredientsReturnRef.current ?? { screen: 'cook-at-home' as Screen, tab: 'cook-at-home' as Tab };
    ingredientsReturnRef.current = null;
    navStackRef.current.push(returnTo);
    setIngredientRecipe(null);
    setIngredientIncluded({});
    setScreenState('cart');
  }, [ingredientRecipe, ingredientSelections, ingredientIncluded, addToCart, showToast, supermarketName, selectedSupermarketId]);

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
      const resolved = resolveQuickMeal(meal.quickMealId, profile, selectedSupermarketId);
      return resolved?.items ?? [];
    }
    return [];
  }, [supermarketName, selectedSupermarketId, profile]);

  const addPlannedMealToCart = useCallback((meal: PlannedMeal) => {
    const items = plannedMealToCartItems(meal);
    if (items.length === 0) {
      showToast(`Couldn't add ${meal.title} — check your area and supermarket.`);
      return;
    }
    addToCart(items);
    showToast(`${meal.title} added to cart`);
  }, [plannedMealToCartItems, addToCart, showToast]);

  const addPlannedMealsToCart = useCallback((dayKey: DayKey) => {
    const day = weeklyPlan.days.find((d) => d.dayKey === dayKey);
    if (!day) return;
    const items: CartItemInput[] = [];
    const skipped: string[] = [];
    day.meals.forEach((meal) => {
      if (meal.planSkipped) return;
      const mealItems = plannedMealToCartItems(meal);
      if (mealItems.length === 0) skipped.push(meal.title);
      else items.push(...mealItems);
    });
    if (items.length === 0) {
      showToast(`Couldn't add ${dayKey}'s meals — check delivery area and supermarket.`);
      return;
    }
    addToCart(items);
    if (skipped.length > 0) {
      showToast(`Added ${day.meals.length - skipped.length} meals — skipped: ${skipped.join(', ')}`);
    } else {
      showToast(`${dayKey}'s meals added to cart`);
    }
    navigateScreen('cart');
  }, [weeklyPlan, plannedMealToCartItems, addToCart, showToast, navigateScreen]);

  const addPlannedWeekToCart = useCallback(() => {
    const items: CartItemInput[] = [];
    const skipped: string[] = [];
    weeklyPlan.days.forEach((day) => {
      day.meals.forEach((meal) => {
        if (meal.planSkipped) return;
        const mealItems = plannedMealToCartItems(meal);
        if (mealItems.length === 0) skipped.push(meal.title);
        else items.push(...mealItems);
      });
    });
    if (items.length === 0) {
      showToast("Couldn't add the week — check delivery area and supermarket.");
      return;
    }
    const { estimatedDeliveries } = summarizePlanBudget(weeklyPlan);
    const cartEstimate = weeklyPlan.days.reduce(
      (sum, day) => sum + cartCostForDayMeals(
        day.meals.filter((meal) => !meal.planSkipped),
        profile,
        selectedSupermarketId,
      ),
      0,
    );
    addToCart(items);
    if (skipped.length > 0) {
      showToast(`Week added with gaps — ${skipped.length} meals skipped. Review cart.`);
    } else {
      showToast(`Full week in cart · packs ~${formatEgp(cartEstimate)} · up to ${estimatedDeliveries} deliveries`);
    }
    navigateScreen('cart');
  }, [weeklyPlan, plannedMealToCartItems, addToCart, showToast, navigateScreen, profile, selectedSupermarketId]);

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
    navStackRef.current = [];
    setScreenState('order-success');
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
    if (items.length === 0) {
      showToast(`Couldn't reorder from ${delivery.vendorName}`);
      return;
    }
    addToCart(items);
    showToast(`Reordered from ${delivery.vendorName}`);
    navigateScreen('cart');
  }, [addToCart, showToast, navigateScreen]);

  const reorderFromOrder = useCallback((order: Order) => {
    const items = reorderOrder(order.deliveries);
    if (items.length === 0) {
      showToast("Couldn't reorder — items may no longer be available.");
      return;
    }
    addToCart(items);
    showToast('Full order added to cart');
    navigateScreen('cart');
  }, [addToCart, showToast, navigateScreen]);

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

  const openFavorite = useCallback((fav: Favorite) => {
    if (fav.kind === 'meal' && fav.restaurantId && fav.mealId) {
      const r = getRestaurant(fav.restaurantId);
      if (!r) {
        showToast('This restaurant is no longer available.');
        return;
      }
      openRestaurant(r, fav.mealId);
      return;
    }
    if (fav.kind === 'recipe' && fav.recipeId) {
      const r = getRecipe(fav.recipeId);
      if (!r) {
        showToast('This recipe is no longer available.');
        return;
      }
      openIngredients(r);
      return;
    }
    if (fav.kind === 'product' && fav.productId) {
      if (addShopProductToCart(fav.productId)) {
        navigateScreen('cart');
      } else {
        navigateScreen('groceries');
      }
    }
  }, [openRestaurant, openIngredients, addShopProductToCart, showToast, navigateScreen]);

  const openQuickMealPreview = useCallback((meal: PlannedMeal) => {
    if (!meal.quickMealId) {
      showToast('This quick meal is unavailable.');
      return;
    }
    const resolved = resolveQuickMeal(meal.quickMealId, profile, selectedSupermarketId);
    if (!resolved) {
      showToast('This quick meal is unavailable.');
      return;
    }
    if (resolved.items.length === 0) {
      showToast(resolved.unavailable.join(' · ') || 'Items not available in your area or store.');
      return;
    }
    setQuickMealPreview({ title: meal.title, resolved });
  }, [profile, selectedSupermarketId, showToast]);

  const closeQuickMealPreview = useCallback(() => {
    setQuickMealPreview(null);
  }, []);

  const confirmQuickMealAdd = useCallback(() => {
    if (!quickMealPreview || quickMealPreview.resolved.items.length === 0) return;
    const { title, resolved } = quickMealPreview;
    addToCart(resolved.items);
    if (resolved.unavailable.length > 0) {
      showToast(`${title} added — some items unavailable: ${resolved.unavailable.join(', ')}`);
    } else {
      showToast(`${title} added to cart`);
    }
    setQuickMealPreview(null);
    navigateScreen('cart');
  }, [quickMealPreview, addToCart, showToast, navigateScreen]);

  const cartTotal = useMemo(() => sumCart(cart), [cart]);

  const value: AppContextValue = {
    screen, tab, profile, onboardingStep, cart,
    activeRestaurant, highlightedMealId, ingredientRecipe, ingredientSelections, ingredientIncluded,
    lastOrder, orderHistory, favorites, toast, selectedSupermarketId,
    selectedPlanDay, weeklyPlan, planOverrides, quickMealPreview,
    setScreen: navigateScreen, goBack, setTab, goTab, setProfile, setOnboardingStep,
    completeOnboarding, resetOnboarding, showToast, addToCart,
    removeCartLine, updateCartQuantity, removeCartGroup,
    openRestaurant, closeRestaurant, addMealToCart, addShopProductToCart,
    openIngredients, closeIngredients, setIngredientSelection: (ingredientId, productId) => {
      setIngredientSelections((s) => ({ ...s, [ingredientId]: productId }));
    },
    toggleIngredientIncluded: (ingredientId) => {
      setIngredientIncluded((s) => ({ ...s, [ingredientId]: s[ingredientId] === false }));
    },
    addIngredientsToCart, addPlannedMealsToCart, addPlannedWeekToCart, addPlannedMealToCart,
    setSelectedPlanDay, togglePlanMealSkipped, togglePlanDaySkipped, swapPlanMeal,
    placeOrder, markOrderDelivered,
    reorderFromDelivery, reorderFromOrder, isFavorite, toggleFavorite, openFavorite,
    setSelectedSupermarketId, setRecipeSupermarket, openQuickMealPreview, closeQuickMealPreview,
    confirmQuickMealAdd, cartTotal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
