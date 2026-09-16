import type { WeeklyPlan } from '../planning/types';

export interface PlanBudgetSummary {
  weekShopTotal: number;
  avgRestDay: number;
  avgGymDay: number;
  estimatedDeliveries: number;
  restaurantMealCount: number;
  homeMealCount: number;
}

export function summarizePlanBudget(plan: WeeklyPlan): PlanBudgetSummary {
  const restDays = plan.days.filter((d) => !d.isGymDay);
  const gymDays = plan.days.filter((d) => d.isGymDay);

  const avg = (days: typeof plan.days) => (
    days.length === 0 ? 0 : Math.round(days.reduce((s, d) => s + d.dayTotal, 0) / days.length)
  );

  const restaurants = new Set<string>();
  let hasGrocery = false;
  let restaurantMeals = 0;
  let homeMeals = 0;

  plan.days.forEach((day) => {
    day.meals.forEach((meal) => {
      if (meal.source === 'restaurant' && meal.restaurantId) {
        restaurants.add(meal.restaurantId);
        restaurantMeals += 1;
      } else {
        homeMeals += 1;
        if (meal.source === 'recipe' || meal.source === 'quick') hasGrocery = true;
      }
    });
  });

  return {
    weekShopTotal: plan.days.reduce((s, d) => s + d.dayTotal, 0),
    avgRestDay: avg(restDays),
    avgGymDay: avg(gymDays),
    estimatedDeliveries: restaurants.size + (hasGrocery ? 1 : 0),
    restaurantMealCount: restaurantMeals,
    homeMealCount: homeMeals,
  };
}
