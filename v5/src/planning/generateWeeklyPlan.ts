import type { Goal } from '../types';
import { getTodayKey, WEEK_ORDER } from '../utils';
import {
  pickKey, poolForSlot, quickPoolForGoal, type MealPick,
} from './catalog';
import { buildQuickWhy, buildWhy } from './why';
import { pickBest } from './scoring';
import { SLOT_LABELS, slotTimes } from './timing';
import type { DayKey, PlannedDay, PlannedMeal, PlanInput, WeeklyPlan } from './types';

function hashSeed(input: PlanInput): number {
  const s = `${input.goal}|${input.gymDays.join()}|${input.area}|${weekAnchor()}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
  return Math.abs(h);
}

function weekAnchor(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 6 ? 0 : day + 1;
  const sat = new Date(d);
  sat.setDate(d.getDate() - diff);
  return sat.toISOString().slice(0, 10);
}

function mealTypeForSlot(slot: string): PlannedMeal['type'] {
  if (slot === 'pre-workout') return 'pre-workout';
  if (slot === 'post-workout') return 'post-workout';
  return 'meal';
}

function toPlannedMeal(
  slot: PlannedMeal['slotId'],
  pick: MealPick,
  times: Record<string, string>,
  goal: Goal,
  isGymDay: boolean,
): PlannedMeal {
  const base = {
    slotId: slot,
    time: times[slot] ?? '12:00',
    label: SLOT_LABELS[slot] ?? slot,
    type: mealTypeForSlot(slot),
    why: buildWhy(slot, pick, goal, isGymDay),
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
    image: pick.image,
  };
}

function slotsForDay(isGymDay: boolean): PlannedMeal['slotId'][] {
  if (isGymDay) return ['breakfast', 'lunch', 'pre-workout', 'post-workout'];
  return ['breakfast', 'lunch', 'dinner'];
}

function buildDay(
  dayKey: DayKey,
  dayIndex: number,
  input: PlanInput,
  seed: number,
  usedKeys: Set<string>,
): PlannedDay {
  const isGymDay = input.gymDays.includes(dayKey);
  const isToday = dayKey === getTodayKey();
  const times = slotTimes(input.gymTime, isGymDay);
  const meals: PlannedMeal[] = [];

  for (const slot of slotsForDay(isGymDay)) {
    if (slot === 'pre-workout') {
      const quickPool = quickPoolForGoal(input.goal);
      const q = quickPool[dayIndex % quickPool.length];
      if (q) {
        meals.push({
          slotId: 'pre-workout',
          time: times['pre-workout'],
          label: SLOT_LABELS['pre-workout'],
          title: q.title,
          type: 'pre-workout',
          source: 'quick',
          quickMealId: q.id,
          why: buildQuickWhy(input.goal),
          estimatedPrice: q.estimatedPrice,
          protein: q.protein,
          calories: q.calories,
          image: q.image,
        });
      }
      continue;
    }

    const pool = poolForSlot(slot, input.goal, input.area);
    const pick = pickBest(pool, input.goal, dayIndex, seed, usedKeys);
    if (!pick) continue;

    usedKeys.add(pickKey(pick));
    meals.push(toPlannedMeal(slot, pick, times, input.goal, isGymDay));
  }

  const dayTotal = meals.reduce((s, m) => s + m.estimatedPrice, 0);
  const dayProtein = meals.reduce((s, m) => s + (m.protein ?? 0), 0);

  return { dayKey, isGymDay, isToday, meals, dayTotal, dayProtein };
}

export function generateWeeklyPlan(input: PlanInput): WeeklyPlan {
  const seed = hashSeed(input);
  const usedKeys = new Set<string>();
  const days = WEEK_ORDER.map((dayKey, i) =>
    buildDay(dayKey, i, input, seed, usedKeys),
  );

  const avgDailyCost = Math.round(days.reduce((s, d) => s + d.dayTotal, 0) / 7);
  const avgDailyProtein = Math.round(days.reduce((s, d) => s + d.dayProtein, 0) / 7);

  return {
    days,
    summary: {
      gymDaysCount: input.gymDays.length,
      avgDailyCost,
      avgDailyProtein,
      goal: input.goal,
    },
  };
}
