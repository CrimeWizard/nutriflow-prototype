import type { Goal } from '../types';
import type { MealPick } from './catalog';
import type { MealSlotId } from './types';

export function buildWhy(
  slot: MealSlotId,
  pick: MealPick,
  goal: Goal,
  isGymDay: boolean,
): string {
  if (slot === 'pre-workout') {
    return 'Quick carbs ~90 min before gym';
  }

  if (pick.kind === 'restaurant') {
    const areaBit = pick.inArea ? `From ${pick.restaurantName}` : `From ${pick.restaurantName} · nearby`;
    if (slot === 'post-workout' && isGymDay) {
      if (goal === 'bulk') return `${pick.protein}g protein — refuel after training · ${areaBit}`;
      if (goal === 'cut') return `${pick.protein}g protein, lighter portion — post-workout · ${areaBit}`;
      return `${pick.protein}g protein — recovery meal · ${areaBit}`;
    }
    if (slot === 'breakfast' && goal === 'bulk') {
      return `${pick.protein}g protein — strong start for muscle gain`;
    }
    if (slot === 'breakfast' && goal === 'cut') {
      return `${pick.calories} cal — lighter breakfast for your cut`;
    }
    if (!isGymDay && slot === 'dinner') {
      return `Rest day dinner · ${areaBit}`;
    }
    return `${pick.protein}g protein · ${areaBit}`;
  }

  if (slot === 'post-workout') {
    return 'Cook at home — high-protein post-workout meal';
  }
  if (!isGymDay) {
    return 'Cook at home — easier on rest days';
  }
  if (goal === 'cut') {
    return 'Home-cooked — portion control on your cut';
  }
  return 'Cook at home — balanced meal for your goal';
}

export function buildQuickWhy(goal: Goal): string {
  if (goal === 'bulk') return 'Fast protein + carbs before training';
  return 'Light fuel ~90 min before gym';
}
