import { getDefaultProducts, getRecipe, getRestaurant } from '../data/mockData';
import type { PlannedMeal } from '../planning/types';
import { resolveQuickMeal } from './quickMealResolve';
import type { UserProfile } from '../types';
import { formatEgp } from '../utils';

export function planMealUsesEstimate(meal: PlannedMeal): boolean {
  return meal.source === 'recipe' || meal.source === 'quick';
}

export function cartCostForPlannedMeal(
  meal: PlannedMeal,
  profile: UserProfile,
  supermarketId: string,
): number {
  if (meal.source === 'restaurant' && meal.restaurantId && meal.mealId) {
    const restaurant = getRestaurant(meal.restaurantId);
    const menuMeal = restaurant?.meals.find((item) => item.id === meal.mealId);
    return menuMeal?.price ?? meal.estimatedPrice;
  }

  if (meal.source === 'recipe' && meal.recipeId) {
    const recipe = getRecipe(meal.recipeId);
    if (!recipe) return meal.estimatedPrice;
    return getDefaultProducts(recipe).reduce((sum, product) => sum + product.price, 0);
  }

  if (meal.source === 'quick' && meal.quickMealId) {
    const resolved = resolveQuickMeal(meal.quickMealId, profile, supermarketId);
    if (!resolved) return meal.estimatedPrice;
    return resolved.items.reduce((sum, item) => sum + item.price, 0);
  }

  return meal.estimatedPrice;
}

export function formatPlanMealPrice(
  meal: PlannedMeal,
  profile: UserProfile,
  supermarketId: string,
): string {
  if (!planMealUsesEstimate(meal)) {
    return formatEgp(meal.estimatedPrice);
  }

  const cartCost = cartCostForPlannedMeal(meal, profile, supermarketId);
  const estimate = formatEgp(meal.estimatedPrice);
  if (cartCost > meal.estimatedPrice + 5) {
    return `~${estimate} est. · packs ${formatEgp(cartCost)}`;
  }
  return `~${estimate} est.`;
}

export function cartCostForDayMeals(
  meals: PlannedMeal[],
  profile: UserProfile,
  supermarketId: string,
): number {
  return meals.reduce(
    (sum, meal) => sum + cartCostForPlannedMeal(meal, profile, supermarketId),
    0,
  );
}
