import { getDefaultProducts, quickMeals, recipes, restaurants } from '../data/mockData';
import type { Goal, Restaurant, RestaurantMeal } from '../types';
import type { MealSlotId } from './types';

export interface RestaurantPick {
  kind: 'restaurant';
  restaurantId: string;
  mealId: string;
  title: string;
  price: number;
  protein: number;
  calories: number;
  image: string;
  tags: string[];
  restaurantName: string;
  inArea: boolean;
}

export interface RecipePick {
  kind: 'recipe';
  recipeId: string;
  title: string;
  price: number;
  image: string;
  tags: string[];
}

export type MealPick = RestaurantPick | RecipePick;

export function restaurantsInArea(area: string): Restaurant[] {
  return restaurants.filter((r) => r.area === area);
}

function flattenRestaurantMeals(area: string): RestaurantPick[] {
  const picks: RestaurantPick[] = [];
  restaurantsInArea(area).forEach((r) => {
    r.meals.forEach((m) => {
      picks.push(mealToPick(r, m, true));
    });
  });
  return picks;
}

function mealToPick(r: Restaurant, m: RestaurantMeal, inArea: boolean): RestaurantPick {
  return {
    kind: 'restaurant',
    restaurantId: r.id,
    mealId: m.id,
    title: m.name,
    price: m.price,
    protein: m.protein,
    calories: m.calories,
    image: m.image,
    tags: m.tags,
    restaurantName: r.name,
    inArea,
  };
}

function flattenRecipes(): RecipePick[] {
  return recipes.map((r) => ({
    kind: 'recipe',
    recipeId: r.id,
    title: r.name,
    price: getDefaultProducts(r).reduce((s, p) => s + p.price, 0),
    image: r.image,
    tags: r.tags,
  }));
}

const BREAKFAST_TAGS = new Set(['breakfast', 'sweet']);
const LUNCH_TAGS = new Set(['lunch', 'bestseller', 'high-protein', 'low-carb']);
const LIGHT_TAGS = new Set(['low-carb', 'salads', 'vegetarian', 'light']);
const HEAVY_TAGS = new Set(['post-workout', 'high-protein', 'bestseller']);

export function poolForSlot(slot: MealSlotId, goal: Goal, area: string): MealPick[] {
  const meals = flattenRestaurantMeals(area);
  const recipeList = flattenRecipes();

  if (slot === 'breakfast') {
    const fromRest = meals.filter((m) => m.tags.some((t) => BREAKFAST_TAGS.has(t)));
    const fromRecipes = recipeList.filter((r) => r.tags.includes('breakfast'));
    return [...fromRest, ...fromRecipes];
  }

  if (slot === 'lunch') {
    if (goal === 'cut') {
      return meals.filter((m) =>
        m.tags.some((t) => LIGHT_TAGS.has(t) || LUNCH_TAGS.has(t)),
      );
    }
    if (goal === 'bulk') {
      return meals.filter((m) => m.protein >= 32 || m.tags.some((t) => HEAVY_TAGS.has(t)));
    }
    return meals.filter((m) =>
      !m.tags.includes('breakfast') && !m.tags.includes('sweet') && !m.tags.includes('snack'),
    );
  }

  if (slot === 'dinner') {
    if (goal === 'cut') {
      return [
        ...meals.filter((m) => m.tags.some((t) => LIGHT_TAGS.has(t) || m.calories < 400)),
        ...recipeList,
      ];
    }
    return [...recipeList, ...meals.filter((m) => m.tags.includes('dinner') || m.protein >= 30)];
  }

  if (slot === 'post-workout') {
    if (goal === 'cut') {
      return meals.filter((m) => m.protein >= 28 && m.calories < 450);
    }
    if (goal === 'bulk') {
      return [
        ...meals.filter((m) => m.protein >= 36),
        ...recipeList.filter((r) => r.tags.includes('high-protein') || r.tags.includes('meal-prep')),
      ];
    }
    return [
      ...meals.filter((m) => m.protein >= 30),
      ...recipeList,
    ];
  }

  return meals;
}

export function quickPoolForGoal(goal: Goal) {
  if (goal === 'bulk') {
    return quickMeals.filter((q) => q.id === 'quick-protein-smoothie' || q.id === 'quick-banana-yogurt');
  }
  return quickMeals.filter((q) => q.id === 'quick-banana-yogurt');
}

export function pickKey(p: MealPick): string {
  return p.kind === 'restaurant' ? `r:${p.mealId}` : `recipe:${p.recipeId}`;
}
