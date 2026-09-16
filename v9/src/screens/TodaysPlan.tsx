import { ChevronRight, ShoppingBasket, Store, UtensilsCrossed } from 'lucide-react';
import { FoodImage } from '../components/FoodImage';
import { useApp } from '../context/AppContext';
import { getRecipe, getRestaurant } from '../data/mockData';
import { plannedMealPhoto } from '../lib/foodImages';
import type { PlannedMeal } from '../planning/types';
import { formatEgp, getTodayKey } from '../utils';

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
    weeklyPlan, openRestaurant, openIngredients, openQuickMealPreview, addPlannedMealsToCart,
  } = useApp();
  const todayKey = getTodayKey();
  const todayDay = weeklyPlan.days.find((d) => d.isToday) ?? weeklyPlan.days[0];

  const handleMealClick = (meal: PlannedMeal) => {
    if (meal.source === 'restaurant' && meal.restaurantId) {
      const restaurant = getRestaurant(meal.restaurantId);
      if (restaurant) openRestaurant(restaurant);
      return;
    }
    if (meal.source === 'recipe' && meal.recipeId) {
      const recipe = getRecipe(meal.recipeId);
      if (recipe) openIngredients(recipe);
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
        <h1>Today's plan</h1>
        <p>
          {todayDay.dayProtein}g protein · ~{formatEgp(todayDay.dayTotal)} planned
          {todayDay.isGymDay ? ' · Gym day' : ' · Rest day'}
        </p>
      </div>

      <div className="meal-list">
        {todayDay.meals.map((meal) => (
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
        onClick={() => addPlannedMealsToCart(todayKey)}
      >
        <ShoppingBasket size={18} />
        Add today's plan to cart · {formatEgp(todayDay.dayTotal)}
      </button>
    </div>
  );
}
