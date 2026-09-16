export interface SupermarketProduct {
  id: string;
  brand: string;
  name: string;
  size: string;
  price: number;
  image: string;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: string;
  options: SupermarketProduct[];
  defaultOptionId: string;
}

export interface Recipe {
  id: string;
  name: string;
  time: string;
  servings: number;
  image: string;
  tags: string[];
  ingredients: RecipeIngredient[];
}

export interface RestaurantMeal {
  id: string;
  name: string;
  description: string;
  price: number;
  protein: number;
  calories: number;
  image: string;
  tags: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  area: string;
  cuisine: string;
  deliveryMins: string;
  rating: number;
  tags: string[];
  image: string;
  meals: RestaurantMeal[];
}

export interface QuickMealMatcher {
  brand: string;
  name: string;
  restaurantMealId?: string;
  restaurantId?: string;
}

export interface QuickMeal {
  id: string;
  title: string;
  image: string;
  estimatedPrice: number;
  protein: number;
  calories: number;
  matchers: QuickMealMatcher[];
}

export type ProductCategory = 'Dairy' | 'Meat' | 'Grains' | 'Produce' | 'Pantry';

export interface Supermarket {
  id: string;
  name: string;
  image: string;
  deliveryMins: string;
  tagline: string;
}

export interface ShopProduct {
  id: string;
  supermarketId: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  size: string;
  image: string;
}

export type CartSource = 'restaurant' | 'supermarket';

export interface CartItem {
  cartLineId: string;
  productId: string;
  name: string;
  brand?: string;
  size?: string;
  price: number;
  quantity: number;
  image: string;
  source: CartSource;
  vendorName: string;
  fromRecipe?: string;
}

export type Goal = 'cut' | 'maintain' | 'bulk';
export type BudgetTier = 'tight' | 'moderate' | 'flexible';
export type ShoppingMode = 'groceries' | 'restaurants' | 'mix';

export interface UserProfile {
  name: string;
  phone: string;
  area: string;
  address: string;
  gymDays: string[];
  gymTime: string;
  goal: Goal;
  shoppingMode: ShoppingMode;
  budgetTier: BudgetTier;
}

export interface DeliveryGroup {
  id: string;
  vendorName: string;
  source: CartSource;
  items: CartItem[];
  subtotal: number;
  eta: string;
}

export type OrderStatus = 'active' | 'delivered';

export interface Order {
  id: string;
  deliveries: DeliveryGroup[];
  total: number;
  placedAt: Date;
  status: OrderStatus;
  deliveredAt?: string;
}

export type FavoriteKind = 'meal' | 'recipe' | 'product';

export interface Favorite {
  key: string;
  kind: FavoriteKind;
  title: string;
  image: string;
  price?: number;
  restaurantId?: string;
  mealId?: string;
  recipeId?: string;
  productId?: string;
  vendorName?: string;
}

export type Tab = 'home' | 'cook-at-home' | 'orders' | 'today-plan' | 'profile';

export type Screen =
  | 'onboarding'
  | Tab
  | 'restaurants'
  | 'groceries'
  | 'supplements'
  | 'cart'
  | 'restaurant-menu'
  | 'ingredients'
  | 'checkout'
  | 'order-success';
