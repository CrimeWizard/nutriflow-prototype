import {
  ChevronRight, Dumbbell, ShoppingBasket, Store, Utensils, UtensilsCrossed, Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRecipe, getRestaurant } from '../data/mockData';
import type { PlannedMeal } from '../planning/types';
import { formatEgp, getTodayKey, goalLabel, isGymDay, WEEK_ORDER } from '../utils';

function MealIcon({ type }: { type: string }) {
  if (type === 'pre-workout') return <Zap size={18} />;
  if (type === 'post-workout') return <Dumbbell size={18} />;
  return <Utensils size={18} />;
}

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

export function Home() {
  const {
    profile, weeklyPlan, selectedPlanDay, setSelectedPlanDay,
    openRestaurant, openIngredients, addPlannedMealsToCart, addPlannedMealToCart,
  } = useApp();

  const name = profile.name || 'there';
  const todayKey = getTodayKey();
  const selectedDay = weeklyPlan.days.find((d) => d.dayKey === selectedPlanDay)
    ?? weeklyPlan.days.find((d) => d.isToday)
    ?? weeklyPlan.days[0];
  const gymToday = isGymDay(todayKey, profile.gymDays);
  const { summary } = weeklyPlan;

  const handleMealClick = (meal: PlannedMeal) => {
    if (meal.source === 'restaurant' && meal.restaurantId) {
      const r = getRestaurant(meal.restaurantId);
      if (r) openRestaurant(r);
      return;
    }
    if (meal.source === 'recipe' && meal.recipeId) {
      const r = getRecipe(meal.recipeId);
      if (r) openIngredients(r);
      return;
    }
    if (meal.source === 'quick') {
      addPlannedMealToCart(meal);
    }
  };

  const actionLabel = (meal: PlannedMeal) => {
    if (meal.source === 'restaurant') return 'View restaurant';
    if (meal.source === 'recipe') return 'Shop ingredients';
    return 'Add to cart';
  };

  return (
    <div className="scroll fade-in">
      <div className="page-header">
        <h1>Hey, {name}</h1>
        <p>{profile.area} · {gymToday ? 'Gym day' : 'Rest day'}</p>
      </div>

      <div className="hero-card">
        <div className="hero-eyebrow">Your week · Sat – Fri</div>
        <h2>
          {summary.gymDaysCount} gym days · ~{formatEgp(summary.avgDailyCost)}/day
        </h2>
        <p>
          ~{summary.avgDailyProtein}g protein/day · {goalLabel(summary.goal)}
          {gymToday
            ? ` · Training at ${profile.gymTime}`
            : ' · Lighter plan on rest days'}
        </p>
        <div className="hero-meta">
          <span>{goalLabel(profile.goal)}</span>
          <span>{profile.gymDays.length} gym days/week</span>
        </div>
      </div>

      <p className="section-title">This week</p>
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
              <div className={`meal-icon-wrap ${meal.type === 'pre-workout' ? 'pre' : meal.type === 'post-workout' ? 'post' : ''}`}>
                <MealIcon type={meal.type} />
              </div>
              <div>
                <div className="meal-meta">{meal.time} · {meal.label}</div>
                <h3>{meal.title}</h3>
                <p className="meal-why">{meal.why}</p>
                <SourceBadge source={meal.source} />
              </div>
            </div>
            <div className="meal-item-footer">
              {actionLabel(meal)}
              <ChevronRight size={16} />
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => addPlannedMealsToCart(selectedPlanDay)}
      >
        <ShoppingBasket size={18} />
        Add {selectedDay.isToday ? "today's" : `${selectedDay.dayKey}'s`} meals to cart
      </button>
      <p className="cta-hint">
        {formatEgp(selectedDay.dayTotal)} · {selectedDay.dayProtein}g protein for this day
      </p>
    </div>
  );
}
