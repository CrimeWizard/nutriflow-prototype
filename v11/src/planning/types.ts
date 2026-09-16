import type { BudgetTier, Goal, ShoppingMode } from '../types';

export type DayKey = 'Sat' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export type MealSlotId = 'breakfast' | 'lunch' | 'pre-workout' | 'dinner' | 'post-workout';

export interface PlannedMeal {
  slotId: MealSlotId;
  time: string;
  label: string;
  title: string;
  type: 'meal' | 'pre-workout' | 'post-workout';
  source: 'restaurant' | 'recipe' | 'quick';
  restaurantId?: string;
  mealId?: string;
  recipeId?: string;
  quickMealId?: string;
  why: string;
  estimatedPrice: number;
  protein?: number;
  calories?: number;
  image?: string;
  planSkipped?: boolean;
}

export interface PlannedDay {
  dayKey: DayKey;
  isGymDay: boolean;
  isToday: boolean;
  meals: PlannedMeal[];
  dayTotal: number;
  dayProtein: number;
  planDaySkipped?: boolean;
}

export interface WeeklyPlanSummary {
  gymDaysCount: number;
  avgDailyCost: number;
  avgDailyProtein: number;
  goal: Goal;
}

export interface WeeklyPlan {
  days: PlannedDay[];
  summary: WeeklyPlanSummary;
}

export interface PlanInput {
  goal: Goal;
  gymDays: string[];
  gymTime: string;
  area: string;
  budgetTier: BudgetTier;
  shoppingMode: ShoppingMode;
}
