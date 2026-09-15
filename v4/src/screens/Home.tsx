import { ChevronRight, Dumbbell, ShoppingBasket, Store, Utensils, UtensilsCrossed, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRecipe, getRestaurant, todayMeals } from '../data/mockData';
import { goalLabel, isGymToday } from '../utils';

function MealIcon({ type }: { type: string }) {
  if (type === 'pre-workout') return <Zap size={18} />;
  if (type === 'post-workout') return <Dumbbell size={18} />;
  return <Utensils size={18} />;
}

function SourceBadge({ source }: { source: string }) {
  if (source === 'restaurant') {
    return <span className="source-badge"><UtensilsCrossed size={11} /> Restaurant</span>;
  }
  if (source === 'recipe') {
    return <span className="source-badge"><Store size={11} /> Cook at home</span>;
  }
  return null;
}

export function Home() {
  const { profile, openRestaurant, openIngredients, addTodayMealsToCart } = useApp();
  const gymToday = isGymToday(profile.gymDays);
  const name = profile.name || 'there';

  const handleMealClick = (meal: typeof todayMeals[0]) => {
    if (meal.source === 'restaurant' && meal.restaurantId) {
      const r = getRestaurant(meal.restaurantId);
      if (r) openRestaurant(r);
    }
    if (meal.source === 'recipe' && meal.recipeId) {
      const r = getRecipe(meal.recipeId);
      if (r) openIngredients(r);
    }
  };

  return (
    <div className="scroll fade-in">
      <div className="page-header">
        <h1>Hey, {name}</h1>
        <p>{profile.area} · {gymToday ? 'Gym day' : 'Rest day'}</p>
      </div>

      <div className="hero-card">
        <div className="hero-eyebrow">Today</div>
        <h2>Your meals are ready</h2>
        <p>
          {gymToday
            ? `Training at ${profile.gymTime} — restaurant picks and groceries planned for you.`
            : 'Mix of healthy restaurant meals and cook-at-home options.'}
        </p>
        <div className="hero-meta">
          <span>{goalLabel(profile.goal)}</span>
          <span>{profile.gymDays.length} gym days/week</span>
        </div>
      </div>

      <p className="section-title">Today&apos;s meals</p>
      <div className="meal-list">
        {todayMeals.map((meal) => (
          <button
            key={meal.time}
            type="button"
            className={`meal-item ${meal.source !== 'quick' ? 'has-action' : ''}`}
            onClick={meal.source !== 'quick' ? () => handleMealClick(meal) : undefined}
          >
            <div className="meal-item-inner">
              <div className={`meal-icon-wrap ${meal.type === 'pre-workout' ? 'pre' : meal.type === 'post-workout' ? 'post' : ''}`}>
                <MealIcon type={meal.type} />
              </div>
              <div>
                <div className="meal-meta">{meal.time} · {meal.label}</div>
                <h3>{meal.title}</h3>
                <SourceBadge source={meal.source} />
              </div>
            </div>
            {meal.source !== 'quick' && (
              <div className="meal-item-footer">
                {meal.source === 'restaurant' ? 'View restaurant' : 'Shop ingredients'}
                <ChevronRight size={16} />
              </div>
            )}
          </button>
        ))}
      </div>

      <button type="button" className="btn btn-primary" onClick={addTodayMealsToCart}>
        <ShoppingBasket size={18} />
        Add today&apos;s meals to cart
      </button>
      <p className="cta-hint">Restaurant meals + grocery ingredients in one cart</p>
    </div>
  );
}
