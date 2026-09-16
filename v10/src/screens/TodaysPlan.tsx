import { ChevronRight, ShoppingBasket, Store, UtensilsCrossed } from 'lucide-react';
import { FoodImage } from '../components/FoodImage';
import { useApp } from '../context/AppContext';
import { getRecipe, getRestaurant } from '../data/mockData';
import { summarizePlanBudget } from '../lib/planBudget';
import { plannedMealPhoto } from '../lib/foodImages';
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
    weeklyPlan, selectedPlanDay, setSelectedPlanDay,
    openRestaurant, openIngredients, openQuickMealPreview,
    addPlannedMealsToCart, addPlannedWeekToCart, showToast,
  } = useApp();

  const selectedDay = weeklyPlan.days.find((d) => d.dayKey === selectedPlanDay)
    ?? weeklyPlan.days.find((d) => d.isToday)
    ?? weeklyPlan.days[0];
  const budget = summarizePlanBudget(weeklyPlan);
  const dayLabel = selectedDay.isToday ? 'Today' : selectedDay.dayKey;

  const handleMealClick = (meal: PlannedMeal) => {
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
    if (meal.source === 'restaurant') return 'View restaurant';
    if (meal.source === 'recipe') return 'Shop ingredients';
    return 'Preview & add';
  };

  return (
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
              className={`week-day ${selected ? 'selected' : ''} ${day.isToday ? 'today' : ''}`}
              onClick={() => setSelectedPlanDay(dayKey)}
            >
              <span className="week-day-label">{dayKey}</span>
              {day.isGymDay && <span className="week-day-gym" aria-label="Gym day" />}
              {day.isToday && <span className="week-day-today">Today</span>}
            </button>
          );
        })}
      </div>

      <p className="section-title">
        {selectedDay.isToday ? "Today's meals" : `${selectedDay.dayKey}'s meals`}
        {selectedDay.isGymDay ? ' · Gym day' : ' · Rest day'}
        {' · '}{selectedDay.dayProtein}g protein · ~{formatEgp(selectedDay.dayTotal)}
      </p>

      <div className="meal-list">
        {selectedDay.meals.map((meal) => (
          <button
            key={`${meal.slotId}-${meal.time}`}
            type="button"
            className="meal-item has-action"
            onClick={() => handleMealClick(meal)}
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
              <span>{formatEgp(meal.estimatedPrice)} · {actionLabel(meal)}</span>
              <ChevronRight size={16} />
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => addPlannedMealsToCart(selectedPlanDay)}
      >
        <ShoppingBasket size={18} />
        Add {dayLabel.toLowerCase()} to cart · {formatEgp(selectedDay.dayTotal)}
      </button>

      <button
        type="button"
        className="btn btn-ghost week-shop-btn"
        onClick={() => addPlannedWeekToCart()}
      >
        Shop full week (~{formatEgp(budget.weekShopTotal)})
      </button>
      <p className="week-shop-note">
        If you ordered every planned meal · up to ~{budget.estimatedDeliveries} deliveries
        · {budget.restaurantMealCount} eat-out · {budget.homeMealCount} cook-at-home
      </p>
    </div>
  );
}
