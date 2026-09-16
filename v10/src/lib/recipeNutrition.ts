import type { Recipe } from '../types';

/** Per-serving estimates for plan display (not full ingredient pack prices). */
const PER_SERVING: Record<string, { protein: number; calories: number; costPerServing: number }> = {
  r1: { protein: 42, calories: 480, costPerServing: 85 },
  r2: { protein: 18, calories: 320, costPerServing: 35 },
  r3: { protein: 22, calories: 380, costPerServing: 25 },
  r4: { protein: 24, calories: 180, costPerServing: 25 },
  r5: { protein: 28, calories: 220, costPerServing: 30 },
  r6: { protein: 12, calories: 150, costPerServing: 12 },
  r7: { protein: 38, calories: 520, costPerServing: 75 },
  r8: { protein: 14, calories: 350, costPerServing: 22 },
};

const FALLBACK = { protein: 20, calories: 350, costPerServing: 40 };

export function recipeNutrition(recipe: Recipe) {
  return PER_SERVING[recipe.id] ?? FALLBACK;
}
