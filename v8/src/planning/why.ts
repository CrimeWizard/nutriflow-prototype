import type { Goal } from '../types';
import type { MealPick } from './catalog';
import type { MealSlotId } from './types';

export function buildWhy(
  slot: MealSlotId,
  pick: MealPick,
  goal: Goal,
  isGymDay: boolean,
  area: string,
): string {
  if (pick.kind === 'restaurant') {
    const vendor = `From ${pick.restaurantName} · delivers to ${area}`;
    if (slot === 'post-workout' && isGymDay) {
      if (goal === 'bulk') return `${pick.protein}g protein — refuel after training · ${vendor}`;
      if (goal === 'cut') return `${pick.protein}g protein, lighter portion — post-workout · ${vendor}`;
      return `${pick.protein}g protein — recovery meal · ${vendor}`;
    }
    if (slot === 'breakfast' && goal === 'bulk') {
      return `${pick.protein}g protein — strong start for muscle gain · ${vendor}`;
    }
    if (slot === 'breakfast' && goal === 'cut') {
      return `${pick.calories} cal — lighter breakfast for your cut · ${vendor}`;
    }
    if (!isGymDay && slot === 'dinner') {
      return `Lighter rest-day dinner · ${pick.protein}g protein · ${vendor}`;
    }
    if (slot === 'lunch' && goal === 'cut') {
      return `${pick.protein}g protein, ${pick.calories} cal — balanced lunch on your cut · ${vendor}`;
    }
    return `${pick.protein}g protein · ${vendor}`;
  }

  if (slot === 'post-workout' && isGymDay) {
    return `~${pick.protein}g protein/serving — cook at home after training`;
  }
  if (!isGymDay) {
    return `~${pick.protein}g protein/serving · home-cooked · lighter rest-day meal`;
  }
  if (goal === 'cut') {
    return `~${pick.protein}g protein/serving · portion control at home on your cut`;
  }
  if (goal === 'bulk') {
    return `~${pick.protein}g protein/serving · cook at home to support muscle gain`;
  }
  return `~${pick.protein}g protein/serving · balanced home-cooked meal`;
}

export function buildQuickWhy(goal: Goal): string {
  if (goal === 'bulk') {
    return 'Tap to preview · fast protein + carbs ~90 min before gym';
  }
  return 'Tap to preview · light fuel ~90 min before gym';
}
