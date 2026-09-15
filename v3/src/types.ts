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

export interface MealSuggestion {
  time: string;
  label: string;
  title: string;
  type: 'meal' | 'pre-workout' | 'post-workout';
  recipeId?: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  size: string;
  image: string;
}

export interface CartItem {
  productId: string;
  brand: string;
  name: string;
  size: string;
  price: number;
  image: string;
  fromRecipe?: string;
}

export type Goal = 'cut' | 'maintain' | 'bulk';

export interface UserProfile {
  name: string;
  phone: string;
  area: string;
  address: string;
  gymDays: string[];
  gymTime: string;
  goal: Goal;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  placedAt: Date;
  eta: string;
}

export type Tab = 'home' | 'recipes' | 'market' | 'cart';

export type Screen =
  | 'onboarding'
  | Tab
  | 'ingredients'
  | 'checkout'
  | 'order-success';
