import type { Goal } from '../types';

export interface MealNutrition {
  protein: number;
  calories: number;
  tags: string[];
}

export function mealGoalFitLabel(goal: Goal, meal: MealNutrition): string | null {
  if (goal === 'bulk') {
    if (meal.protein >= 36 || meal.tags.includes('post-workout')) return 'Great for bulk';
    if (meal.protein >= 28) return 'Fits your goal';
    return null;
  }
  if (goal === 'cut') {
    if (meal.calories < 380 || meal.tags.includes('low-carb')) return 'Great for cut';
    if (meal.calories < 420 && meal.protein >= 22) return 'Fits your goal';
    return null;
  }
  if (meal.protein >= 25 && meal.calories < 500) return 'Fits your goal';
  if (meal.tags.includes('bestseller')) return 'Popular pick';
  return null;
}

export function mealGoalFitTone(goal: Goal, meal: MealNutrition): 'strong' | 'soft' | null {
  const label = mealGoalFitLabel(goal, meal);
  if (!label) return null;
  if (label.startsWith('Great')) return 'strong';
  return 'soft';
}
