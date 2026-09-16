import { X } from 'lucide-react';
import { FoodImage } from './FoodImage';
import { useApp } from '../context/AppContext';
import { describeSwapOption } from '../lib/planSwap';
import { plannedMealPhoto } from '../lib/foodImages';
import { formatPlanMealPrice } from '../lib/planPricing';
import type { DayKey, MealSlotId, PlannedMeal } from '../planning/types';

export interface PlanSwapTarget {
  dayKey: DayKey;
  slotId: MealSlotId;
  meal: PlannedMeal;
}

interface PlanSwapSheetProps {
  target: PlanSwapTarget | null;
  alternatives: PlannedMeal[];
  onClose: () => void;
}

export function PlanSwapSheet({ target, alternatives, onClose }: PlanSwapSheetProps) {
  const { swapPlanMeal, profile, selectedSupermarketId } = useApp();

  if (!target) return null;

  const pick = (meal: PlannedMeal) => {
    swapPlanMeal(target.dayKey, target.slotId, meal);
    onClose();
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet-panel"
        role="dialog"
        aria-labelledby="plan-swap-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-head">
          <h2 id="plan-swap-title">Swap {target.meal.label.toLowerCase()}</h2>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <p className="sheet-sub">Pick another option for {target.dayKey}. Your plan updates instantly.</p>

        {alternatives.length === 0 ? (
          <p className="sheet-empty">No other options in your area right now.</p>
        ) : (
          <ul className="plan-swap-list">
            {alternatives.map((meal) => (
              <li key={`${meal.source}-${meal.title}`}>
                <button type="button" className="plan-swap-option" onClick={() => pick(meal)}>
                  <span className="plan-swap-thumb">
                    <FoodImage
                      src={plannedMealPhoto(meal)}
                      fallback={meal.image ?? 'plate'}
                      alt=""
                      className="plan-swap-img"
                    />
                  </span>
                  <span className="plan-swap-copy">
                    <strong>{meal.title}</strong>
                    <span>{describeSwapOption(meal)} · {meal.protein ?? 0}g protein</span>
                    <span>{formatPlanMealPrice(meal, profile, selectedSupermarketId)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
