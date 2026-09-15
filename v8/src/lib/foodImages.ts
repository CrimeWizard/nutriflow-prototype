const RESTAURANT_PHOTOS: Record<string, string> = {
  'rest-green-bite': '/images/food/salad-bowl.jpg',
  'rest-fresh-wave': '/images/food/poke.jpg',
  'rest-fit-kitchen': '/images/food/pancakes.jpg',
  'rest-lean-clean': '/images/food/chicken-bowl.jpg',
  'rest-nourish': '/images/food/veggie-bowl.jpg',
  'rest-protein-hub': '/images/food/steak.jpg',
  'rest-cairo-bowls': '/images/food/poke.jpg',
  'rest-power-prep': '/images/food/meal-prep.jpg',
  'rest-grill-co': '/images/food/steak.jpg',
};

const MEAL_PHOTOS: Record<string, string> = {
  'gb-1': '/images/food/chicken-bowl.jpg',
  'gb-2': '/images/food/salmon.jpg',
  'gb-3': '/images/food/wrap.jpg',
  'gb-4': '/images/food/parfait.jpg',
  'gb-5': '/images/food/steak.jpg',
  'gb-6': '/images/food/salad-bowl.jpg',
  'fw-1': '/images/food/poke.jpg',
  'fw-2': '/images/food/shrimp.jpg',
  'fw-3': '/images/food/salmon.jpg',
  'fw-4': '/images/food/tuna-plate.jpg',
  'fk-1': '/images/food/pancakes.jpg',
  'fk-2': '/images/food/chicken-bowl.jpg',
  'fk-3': '/images/food/eggs.jpg',
  'fk-4': '/images/food/smoothie.jpg',
  'lc-1': '/images/food/meal-prep.jpg',
  'lc-2': '/images/food/beef-rice.jpg',
  'lc-3': '/images/food/veggie-bowl.jpg',
  'lc-4': '/images/food/eggs.jpg',
  'lc-5': '/images/food/chicken-bowl.jpg',
  'nl-1': '/images/food/salad-bowl.jpg',
  'nl-2': '/images/food/falafel.jpg',
  'nl-3': '/images/food/smoothie.jpg',
  'nl-4': '/images/food/wrap.jpg',
  'ph-1': '/images/food/chicken-bowl.jpg',
  'ph-2': '/images/food/steak.jpg',
  'ph-3': '/images/food/beef-rice.jpg',
  'ph-4': '/images/food/eggs.jpg',
  'cb-1': '/images/food/poke.jpg',
  'cb-2': '/images/food/salmon.jpg',
  'cb-3': '/images/food/veggie-bowl.jpg',
  'pp-1': '/images/food/meal-prep.jpg',
  'pp-2': '/images/food/chicken-bowl.jpg',
  'pp-3': '/images/food/beef-rice.jpg',
  'gc-1': '/images/food/steak.jpg',
  'gc-2': '/images/food/chicken-bowl.jpg',
  'gc-3': '/images/food/salad-bowl.jpg',
};

const RECIPE_PHOTOS: Record<string, string> = {
  r1: '/images/food/chicken-bowl.jpg',
  r2: '/images/food/oats.jpg',
  r3: '/images/food/veggie-bowl.jpg',
  r4: '/images/food/eggs.jpg',
  r5: '/images/food/tuna-plate.jpg',
  r6: '/images/food/falafel.jpg',
  r7: '/images/food/beef-rice.jpg',
  r8: '/images/food/oats.jpg',
};

const QUICK_PHOTOS: Record<string, string> = {
  'quick-banana-yogurt': '/images/products/banana.jpg',
  'quick-protein-smoothie': '/images/food/smoothie.jpg',
};

export const DEFAULT_RESTAURANT_HERO = '/images/food/restaurant-hero.jpg';

export function restaurantPhoto(restaurantId: string): string | null {
  return RESTAURANT_PHOTOS[restaurantId] ?? null;
}

export function mealPhoto(mealId: string): string | null {
  return MEAL_PHOTOS[mealId] ?? null;
}

export function recipePhoto(recipeId: string): string | null {
  return RECIPE_PHOTOS[recipeId] ?? null;
}

export function quickMealPhoto(quickMealId: string): string | null {
  return QUICK_PHOTOS[quickMealId] ?? null;
}

export function plannedMealPhoto(meal: {
  source: string;
  mealId?: string;
  recipeId?: string;
  quickMealId?: string;
  restaurantId?: string;
}): string | null {
  if (meal.source === 'restaurant' && meal.mealId) return mealPhoto(meal.mealId);
  if (meal.source === 'recipe' && meal.recipeId) return recipePhoto(meal.recipeId);
  if (meal.source === 'quick' && meal.quickMealId) return quickMealPhoto(meal.quickMealId);
  return null;
}
