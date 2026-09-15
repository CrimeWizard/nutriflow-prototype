import type { DayKey } from './planning/types';

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
