import type { Goal } from '../types';
import type { MealPick } from './catalog';
import { pickKey } from './catalog';

export function scoreMeal(
  pick: MealPick,
  goal: Goal,
  dayIndex: number,
  seed: number,
  usedKeys: Set<string>,
): number {
  let score = 0;

  if (pick.kind === 'restaurant') {
    if (pick.inArea) score += 12;
    if (goal === 'bulk') {
      score += pick.protein * 2.2 - pick.calories * 0.015;
    } else if (goal === 'cut') {
      score += pick.protein * 0.8 - pick.calories * 0.035;
      if (pick.tags.includes('low-carb')) score += 8;
    } else {
      score += pick.protein * 1.2 - pick.calories * 0.02;
    }
  } else {
    if (goal === 'cut') score += 6;
    if (goal === 'bulk' && pick.tags.includes('high-protein')) score += 10;
    if (goal === 'maintain') score += 5;
    score -= pick.price * 0.02;
  }

  const key = pickKey(pick);
  if (usedKeys.has(key)) score -= 500;

  score += ((dayIndex + seed) % 7) * 0.3;
  return score;
}

export function pickBest(
  pool: MealPick[],
  goal: Goal,
  dayIndex: number,
  seed: number,
  usedKeys: Set<string>,
): MealPick | null {
  if (pool.length === 0) return null;
  const ranked = [...pool].sort(
    (a, b) => scoreMeal(b, goal, dayIndex, seed, usedKeys) - scoreMeal(a, goal, dayIndex, seed, usedKeys),
  );
  return ranked[0] ?? null;
}
