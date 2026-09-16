import type { DayKey, MealSlotId, PlannedDay, PlannedMeal, WeeklyPlan } from '../planning/types';

export function mealPlanKey(dayKey: DayKey, slotId: MealSlotId): string {
  return `${dayKey}:${slotId}`;
}

export interface PlanOverrides {
  skippedMeals: string[];
  skippedDays: DayKey[];
  replacements: Record<string, PlannedMeal>;
}

export const EMPTY_PLAN_OVERRIDES: PlanOverrides = {
  skippedMeals: [],
  skippedDays: [],
  replacements: {},
};

export function loadPlanOverrides(): PlanOverrides {
  try {
    const raw = localStorage.getItem('nf-v11-plan-overrides');
    if (raw) return JSON.parse(raw) as PlanOverrides;
  } catch { /* empty */ }
  return { ...EMPTY_PLAN_OVERRIDES };
}

export function savePlanOverrides(overrides: PlanOverrides) {
  try {
    localStorage.setItem('nf-v11-plan-overrides', JSON.stringify(overrides));
  } catch { /* empty */ }
}

function mapDayMeals(day: PlannedDay, overrides: PlanOverrides): PlannedMeal[] {
  const daySkipped = overrides.skippedDays.includes(day.dayKey);

  return day.meals.map((meal) => {
    const key = mealPlanKey(day.dayKey, meal.slotId);
    const replaced = overrides.replacements[key] ?? meal;
    const mealSkipped = daySkipped || overrides.skippedMeals.includes(key);
    return { ...replaced, planSkipped: mealSkipped };
  });
}

export function applyPlanOverrides(plan: WeeklyPlan, overrides: PlanOverrides): WeeklyPlan {
  const days = plan.days.map((day) => {
    const meals = mapDayMeals(day, overrides);
    const active = meals.filter((meal) => !meal.planSkipped);
    const dayTotal = active.reduce((sum, meal) => sum + meal.estimatedPrice, 0);
    const dayProtein = active.reduce((sum, meal) => sum + (meal.protein ?? 0), 0);

    return {
      ...day,
      meals,
      dayTotal,
      dayProtein,
      planDaySkipped: overrides.skippedDays.includes(day.dayKey),
    };
  });

  const avgDailyCost = Math.round(days.reduce((sum, day) => sum + day.dayTotal, 0) / 7);
  const avgDailyProtein = Math.round(days.reduce((sum, day) => sum + day.dayProtein, 0) / 7);

  return {
    days,
    summary: {
      ...plan.summary,
      avgDailyCost,
      avgDailyProtein,
    },
  };
}

export function isMealSkipped(overrides: PlanOverrides, dayKey: DayKey, slotId: MealSlotId): boolean {
  return overrides.skippedDays.includes(dayKey)
    || overrides.skippedMeals.includes(mealPlanKey(dayKey, slotId));
}
