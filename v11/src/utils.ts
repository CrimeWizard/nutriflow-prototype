import type { DayKey } from './planning/types';
import type { Order } from './types';

/** Egypt / Islamic week: Saturday → Friday */
export const WEEK_ORDER: DayKey[] = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const JS_DAY_TO_KEY: DayKey[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getTodayKey(): DayKey {
  return JS_DAY_TO_KEY[new Date().getDay()];
}

export function isGymDay(dayKey: DayKey, gymDays: string[]): boolean {
  return gymDays.includes(dayKey);
}

export function isGymToday(gymDays: string[]): boolean {
  return isGymDay(getTodayKey(), gymDays);
}

export function formatEgp(amount: number): string {
  return `${amount.toLocaleString('en-EG')} EGP`;
}

export function generateOrderId(): string {
  return `NF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function goalLabel(goal: string): string {
  const map: Record<string, string> = {
    cut: 'Lose weight',
    maintain: 'Stay fit',
    bulk: 'Build muscle',
  };
  return map[goal] ?? goal;
}

export function budgetLabel(tier: string): string {
  const map: Record<string, string> = {
    tight: 'Tight budget',
    moderate: 'Moderate budget',
    flexible: 'Flexible budget',
  };
  return map[tier] ?? tier;
}

export function shoppingModeLabel(mode: string): string {
  const map: Record<string, string> = {
    groceries: 'Mostly groceries',
    restaurants: 'Mostly restaurants',
    mix: 'Mix of both',
  };
  return map[mode] ?? mode;
}

export const WEEKLY_BUDGET_MAX: Record<string, number> = {
  tight: 600,
  moderate: 900,
  flexible: 99999,
};

export function dailyBudgetMax(tier: string): number {
  const weekly = WEEKLY_BUDGET_MAX[tier] ?? 99999;
  return Math.round(weekly / 7);
}

/** Active = not marked delivered yet (and within 48h for demo safety). */
export function isActiveOrder(order: Order): boolean {
  if (order.status === 'delivered') return false;
  const ms = Date.now() - new Date(order.placedAt).getTime();
  return ms >= 0 && ms < 48 * 60 * 60 * 1000;
}
