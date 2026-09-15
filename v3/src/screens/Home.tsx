import { ChevronRight, Dumbbell, ShoppingBasket, Utensils, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRecipe, todayMeals } from '../data/mockData';
import { goalLabel, isGymToday } from '../utils';

function MealIcon({ type }: { type: string }) {
  if (type === 'pre-workout') return <Zap size={18} />;
  if (type === 'post-workout') return <Dumbbell size={18} />;
  return <Utensils size={18} />;
}

export function Home() {
  const { profile, openIngredients, addTodayMealsToCart } = useApp();
  const gymToday = isGymToday(profile.gymDays);
  const name = profile.name || 'there';

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
            ? `Training at ${profile.gymTime} — we've timed your food around it.`
            : 'Lighter day today. Still picked for your goal.'}
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
            className="meal-item"
            onClick={meal.recipeId ? () => {
              const r = getRecipe(meal.recipeId!);
              if (r) openIngredients(r);
            } : undefined}
            style={{ cursor: meal.recipeId ? 'pointer' : 'default' }}
          >
            <div className="meal-item-inner">
              <div className={`meal-icon-wrap ${meal.type === 'pre-workout' ? 'pre' : meal.type === 'post-workout' ? 'post' : ''}`}>
                <MealIcon type={meal.type} />
              </div>
              <div>
                <div className="meal-meta">{meal.time} · {meal.label}</div>
                <h3>{meal.title}</h3>
              </div>
            </div>
            {meal.recipeId && (
              <div className="meal-item-footer">
                Shop ingredients
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
      <p className="cta-hint">Best brands already picked — change any in Shop ingredients</p>
    </div>
  );
}
