import type { Goal } from '../types';
import { mealGoalFitLabel, mealGoalFitTone, type MealNutrition } from '../lib/goalFit';

interface GoalFitBadgeProps {
  goal: Goal;
  meal: MealNutrition;
}

export function GoalFitBadge({ goal, meal }: GoalFitBadgeProps) {
  const label = mealGoalFitLabel(goal, meal);
  if (!label) return null;
  const tone = mealGoalFitTone(goal, meal);
  return (
    <span className={`goal-fit-badge goal-fit-badge--${tone}`}>
      {label}
    </span>
  );
}
