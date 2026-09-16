import type { Goal } from '../types';
import {
  pickKey, poolForSlot, quickPoolForGoal, type MealPick,
} from '../planning/catalog';
import type { DayKey, MealSlotId, PlanInput, PlannedMeal } from '../planning/types';
import { SLOT_LABELS } from '../planning/timing';
import { buildQuickWhy, buildWhy } from '../planning/why';

function mealTypeForSlot(slot: MealSlotId): PlannedMeal['type'] {
  if (slot === 'pre-workout') return 'pre-workout';
  if (slot === 'post-workout') return 'post-workout';
  return 'meal';
}

function plannedMealFromPick(
  slot: MealSlotId,
  pick: MealPick,
  times: Record<string, string>,
  goal: Goal,
  isGymDay: boolean,
  area: string,
): PlannedMeal {
  const base = {
    slotId: slot,
    time: times[slot] ?? '12:00',
    label: SLOT_LABELS[slot] ?? slot,
    type: mealTypeForSlot(slot),
    why: buildWhy(slot, pick, goal, isGymDay, area),
  };

  if (pick.kind === 'restaurant') {
    return {
      ...base,
      title: pick.title,
      source: 'restaurant',
      restaurantId: pick.restaurantId,
      mealId: pick.mealId,
      estimatedPrice: pick.price,
      protein: pick.protein,
      calories: pick.calories,
      image: pick.image,
    };
  }

  return {
    ...base,
    title: pick.title,
    source: 'recipe',
    recipeId: pick.recipeId,
    estimatedPrice: pick.price,
    protein: pick.protein,
    calories: pick.calories,
    image: pick.image,
  };
}

function currentPickKey(meal: PlannedMeal): string | undefined {
  if (meal.source === 'restaurant' && meal.mealId) return `r:${meal.mealId}`;
  if (meal.source === 'recipe' && meal.recipeId) return `recipe:${meal.recipeId}`;
  return undefined;
}

export function swapAlternativesForMeal(
  meal: PlannedMeal,
  dayKey: DayKey,
  input: PlanInput,
): PlannedMeal[] {
  const isGymDay = input.gymDays.includes(dayKey);
  const times = meal.time ? { [meal.slotId]: meal.time } : {};

  if (meal.source === 'quick' && meal.quickMealId) {
    return quickPoolForGoal(input.goal)
      .filter((q) => q.id !== meal.quickMealId)
      .map((q) => ({
        slotId: meal.slotId,
        time: meal.time,
        label: meal.label,
        title: q.title,
        type: meal.type,
        source: 'quick' as const,
        quickMealId: q.id,
        why: buildQuickWhy(input.goal),
        estimatedPrice: q.estimatedPrice,
        protein: q.protein,
        calories: q.calories,
        image: q.image,
      }));
  }

  const exclude = currentPickKey(meal);
  const picks = poolForSlot(meal.slotId, input.goal, input.area)
    .filter((pick) => pickKey(pick) !== exclude)
    .slice(0, 5);

  return picks.map((pick) => plannedMealFromPick(
    meal.slotId,
    pick,
    times,
    input.goal,
    isGymDay,
    input.area,
  ));
}

export function describeSwapOption(meal: PlannedMeal): string {
  if (meal.source === 'restaurant') return 'Eat out';
  if (meal.source === 'recipe') return 'Cook at home';
  return 'Quick option';
}
