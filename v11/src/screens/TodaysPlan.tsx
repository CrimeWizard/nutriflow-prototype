import { useMemo, useState } from 'react';
import { ChevronRight, RefreshCw, ShoppingBasket, Square, Store, UtensilsCrossed } from 'lucide-react';
import { FoodImage } from '../components/FoodImage';
import { PlanSwapSheet, type PlanSwapTarget } from '../components/PlanSwapSheet';
import { useApp } from '../context/AppContext';
import { getRecipe, getRestaurant } from '../data/mockData';
import { summarizePlanBudget } from '../lib/planBudget';
import { plannedMealPhoto } from '../lib/foodImages';
import { cartCostForDayMeals, formatPlanMealPrice } from '../lib/planPricing';
import { swapAlternativesForMeal } from '../lib/planSwap';
import type { PlannedMeal } from '../planning/types';
import { formatEgp, WEEK_ORDER } from '../utils';

function SourceBadge({ source }: { source: string }) {
  if (source === 'restaurant') {
    return <span className="source-badge restaurant"><UtensilsCrossed size={11} /> Restaurant</span>;
  }
  if (source === 'recipe') {
    return <span className="source-badge recipe"><Store size={11} /> Cook at home</span>;
  }
  if (source === 'quick') {
    return <span className="source-badge">Quick</span>;
  }
  return null;
}

export function TodaysPlan() {
  const {
    profile, weeklyPlan, selectedPlanDay, setSelectedPlanDay, selectedSupermarketId,
    openRestaurant, openIngredients, openQuickMealPreview,
    addPlannedMealsToCart, addPlannedWeekToCart, showToast,
    togglePlanMealSkipped, togglePlanDaySkipped,
  } = useApp();
  const [swapTarget, setSwapTarget] = useState<PlanSwapTarget | null>(null);

  const selectedDay = weeklyPlan.days.find((d) => d.dayKey === selectedPlanDay)
    ?? weeklyPlan.days.find((d) => d.isToday)
    ?? weeklyPlan.days[0];
  const budget = summarizePlanBudget(weeklyPlan);
  const dayLabel = selectedDay.isToday ? 'Today' : selectedDay.dayKey;
  const activeMeals = selectedDay.meals.filter((meal) => !meal.planSkipped);
  const cartDayTotal = cartCostForDayMeals(activeMeals, profile, selectedSupermarketId);

  const swapAlternatives = useMemo(() => {
    if (!swapTarget) return [];
    return swapAlternativesForMeal(swapTarget.meal, swapTarget.dayKey, {
      goal: profile.goal,
      gymDays: profile.gymDays,
      gymTime: profile.gymTime,
      area: profile.area,
      budgetTier: profile.budgetTier,
      shoppingMode: profile.shoppingMode,
    });
  }, [swapTarget, profile]);

  const handleMealClick = (meal: PlannedMeal) => {
    if (meal.planSkipped) return;
    if (meal.source === 'restaurant' && meal.restaurantId) {
      const restaurant = getRestaurant(meal.restaurantId);
      if (!restaurant) {
        showToast('This restaurant is no longer available.');
        return;
      }
      openRestaurant(restaurant, meal.mealId);
      return;
    }
    if (meal.source === 'recipe' && meal.recipeId) {
      const recipe = getRecipe(meal.recipeId);
      if (!recipe) {
        showToast('This recipe is no longer available.');
        return;
      }
      openIngredients(recipe);
      return;
    }
    if (meal.source === 'quick') {
      openQuickMealPreview(meal);
    }
  };

  const actionLabel = (meal: PlannedMeal) => {
    if (meal.planSkipped) return 'Skipped';
    if (meal.source === 'restaurant') return 'View restaurant';
    if (meal.source === 'recipe') return 'Shop ingredients';
    return 'Preview & add';
  };

  return (
    <>
      <div className="scroll fade-in">
        <div className="page-header">
          <h1>Your plan</h1>
          <p>
            {weeklyPlan.summary.gymDaysCount} gym days · ~{weeklyPlan.summary.avgDailyProtein}g protein/day
          </p>
        </div>

        <div className="week-strip">
          {WEEK_ORDER.map((dayKey) => {
            const day = weeklyPlan.days.find((d) => d.dayKey === dayKey)!;
            const selected = dayKey === selectedPlanDay;
            return (
              <button
                key={dayKey}
                type="button"
                className={`week-day ${selected ? 'selected' : ''} ${day.isToday ? 'today' : ''} ${day.planDaySkipped ? 'skipped' : ''}`}
                onClick={() => setSelectedPlanDay(dayKey)}
              >
                <span className="week-day-label">{dayKey}</span>
                {day.isGymDay && <span className="week-day-gym" aria-label="Gym day" />}
                {day.isToday && <span className="week-day-today">Today</span>}
              </button>
            );
          })}
        </div>

        <div className="plan-day-toolbar">
          <p className="section-title plan-day-title">
            {selectedDay.isToday ? "Today's meals" : `${selectedDay.dayKey}'s meals`}
            {selectedDay.isGymDay ? ' · Gym day' : ' · Rest day'}
            {' · '}{selectedDay.dayProtein}g protein · ~{formatEgp(selectedDay.dayTotal)}
          </p>
          <button
            type="button"
            className={`plan-day-skip-btn ${selectedDay.planDaySkipped ? 'active' : ''}`}
            onClick={() => togglePlanDaySkipped(selectedDay.dayKey)}
          >
            <Square size={14} />
            {selectedDay.planDaySkipped ? 'Day skipped' : 'Skip day'}
          </button>
        </div>

        {selectedDay.planDaySkipped ? (
          <p className="plan-day-skipped-note">This day is skipped — tap “Day skipped” to bring meals back.</p>
        ) : (
          <div className="meal-list">
            {selectedDay.meals.map((meal) => (
              <article
                key={`${meal.slotId}-${meal.time}`}
                className={`meal-item plan-meal-item ${meal.planSkipped ? 'plan-meal-item--skipped' : 'has-action'}`}
              >
                <button
                  type="button"
                  className="meal-item-main"
                  onClick={() => handleMealClick(meal)}
                  disabled={meal.planSkipped}
                >
                  <div className="meal-item-inner">
                    <div className={`meal-icon-wrap meal-photo-wrap ${meal.type === 'pre-workout' ? 'pre' : meal.type === 'post-workout' ? 'post' : ''}`}>
                      <FoodImage
                        src={plannedMealPhoto(meal)}
                        fallback={meal.image ?? 'plate'}
                        alt=""
                        className="meal-photo"
                      />
                    </div>
                    <div>
                      <div className="meal-meta">{meal.time} · {meal.label}</div>
                      <h3>{meal.title}</h3>
                      <p className="meal-why">{meal.why}</p>
                      <SourceBadge source={meal.source} />
                    </div>
                  </div>
                  <div className="meal-item-footer">
                    <span>
                      {formatPlanMealPrice(meal, profile, selectedSupermarketId)} · {actionLabel(meal)}
                    </span>
                    {!meal.planSkipped && <ChevronRight size={16} />}
                  </div>
                </button>
                <div className="plan-meal-actions">
                  <button
                    type="button"
                    className={`plan-meal-toggle ${meal.planSkipped ? 'active' : ''}`}
                    onClick={() => togglePlanMealSkipped(selectedDay.dayKey, meal.slotId)}
                  >
                    {meal.planSkipped ? 'Skipped' : 'Included'}
                  </button>
                  <button
                    type="button"
                    className="plan-meal-swap"
                    onClick={() => setSwapTarget({
                      dayKey: selectedDay.dayKey,
                      slotId: meal.slotId,
                      meal,
                    })}
                  >
                    <RefreshCw size={13} />
                    Swap
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="plan-price-note">
          Cook-at-home prices are per-serving estimates. Cart uses full ingredient packs — totals may be higher.
        </p>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => addPlannedMealsToCart(selectedPlanDay)}
          disabled={activeMeals.length === 0}
        >
          <ShoppingBasket size={18} />
          Add {dayLabel.toLowerCase()} to cart
          {activeMeals.length > 0 && ` · packs ~${formatEgp(cartDayTotal)}`}
        </button>

        <button
          type="button"
          className="btn btn-ghost week-shop-btn"
          onClick={() => addPlannedWeekToCart()}
        >
          Shop full week (~{formatEgp(budget.weekShopTotal)} est.)
        </button>
        <p className="week-shop-note">
          Plan guide only · cart uses pack prices · up to ~{budget.estimatedDeliveries} deliveries
        </p>
      </div>

      <PlanSwapSheet
        target={swapTarget}
        alternatives={swapAlternatives}
        onClose={() => setSwapTarget(null)}
      />
    </>
  );
}
