import {
  ChevronRight, Dumbbell, Heart, Package, ShoppingBasket, Store, Target, User, UtensilsCrossed,
} from 'lucide-react';
import { FoodImage } from '../components/FoodImage';
import { BUDGET_TIERS, DELIVERY_AREAS, getRecipe, getRestaurant, GOALS, SHOPPING_MODES } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { plannedMealPhoto } from '../lib/foodImages';
import type { PlannedMeal } from '../planning/types';
import { formatEgp, getTodayKey, goalLabel, isActiveOrder, WEEK_ORDER } from '../utils';

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

export function Profile() {
  const {
    profile, setProfile, orderHistory, favorites, resetOnboarding, setScreen,
    openRestaurant, openIngredients, openQuickMealPreview, showToast, addShopProductToCart,
    weeklyPlan, addPlannedMealsToCart,
  } = useApp();

  const toggleDay = (day: string) => {
    const days = profile.gymDays.includes(day)
      ? profile.gymDays.filter((d) => d !== day)
      : [...profile.gymDays, day];
    setProfile({ gymDays: days });
  };

  const openFavorite = (fav: typeof favorites[number]) => {
    if (fav.kind === 'meal' && fav.restaurantId && fav.mealId) {
      const r = getRestaurant(fav.restaurantId);
      if (r) openRestaurant(r, fav.mealId);
      return;
    }
    if (fav.kind === 'recipe' && fav.recipeId) {
      const r = getRecipe(fav.recipeId);
      if (r) openIngredients(r);
      return;
    }
    if (fav.kind === 'product' && fav.productId) {
      if (addShopProductToCart(fav.productId)) {
        setScreen('cart');
      } else {
        setScreen('groceries');
        showToast('Switch supermarket in Groceries if this item isn’t available');
      }
    }
  };

  const activeOrders = orderHistory.filter((o) => isActiveOrder(o));
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
        <h1>Profile</h1>
        <p>Orders, favorites & settings</p>
      </div>

      <div className="profile-avatar">
        <div className="profile-avatar-circle">
          <User size={28} />
        </div>
        <h2>{profile.name || 'Your name'}</h2>
        <p>{profile.area} · {goalLabel(profile.goal)}</p>
      </div>

      <div className="profile-section today-plan-section">
        <h3>Today's plan</h3>
        <p className="profile-section-sub">
          {todayDay.dayProtein}g protein · ~{formatEgp(todayDay.dayTotal)} planned
          {todayDay.isGymDay ? ' · Gym day' : ' · Rest day'}
        </p>
        <div className="meal-list compact">
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

      <button
        type="button"
        className={`profile-orders-card${activeOrders.length > 0 ? ' profile-orders-card--active' : ''}`}
        onClick={() => setScreen('orders')}
      >
        <div className="profile-orders-card-icon">
          <Package size={20} />
        </div>
        <div className="profile-orders-card-body">
          <strong>My orders</strong>
          <p>
            {activeOrders.length > 0
              ? `${activeOrders.length} on the way · ${orderHistory.length} total`
              : orderHistory.length === 0
                ? 'No orders yet — place one from your cart'
                : `${orderHistory.length} order${orderHistory.length === 1 ? '' : 's'} · view details`}
          </p>
        </div>
        <ChevronRight size={18} />
      </button>

      {favorites.length > 0 && (
        <div className="profile-section">
          <h3><Heart size={16} style={{ verticalAlign: -2 }} /> Favorites</h3>
          <div className="favorites-list">
            {favorites.map((fav) => (
              <button key={fav.key} type="button" className="favorite-row" onClick={() => openFavorite(fav)}>
                <span className="favorite-thumb">{fav.image}</span>
                <div>
                  <strong>{fav.title}</strong>
                  <p>
                    {fav.kind === 'meal' && fav.vendorName}
                    {fav.kind === 'recipe' && 'Recipe'}
                    {fav.kind === 'product' && (fav.vendorName ?? 'Product')}
                    {fav.price != null && ` · ${formatEgp(fav.price)}`}
                  </p>
                </div>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="profile-section">
        <h3>Personal info</h3>
        <div className="field">
          <label className="field-label" htmlFor="prof-name">Name</label>
          <input
            id="prof-name"
            value={profile.name}
            onChange={(e) => setProfile({ name: e.target.value })}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="prof-phone">Phone</label>
          <input
            id="prof-phone"
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ phone: e.target.value })}
          />
        </div>
        <div className="field">
          <label className="field-label">Delivery area</label>
          <div className="area-grid">
            {DELIVERY_AREAS.map((area) => (
              <button
                key={area}
                type="button"
                className={`area-chip ${profile.area === area ? 'selected' : ''}`}
                onClick={() => setProfile({ area })}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="prof-address">Address</label>
          <input
            id="prof-address"
            placeholder="Building, street"
            value={profile.address}
            onChange={(e) => setProfile({ address: e.target.value })}
          />
        </div>
      </div>

      <div className="profile-section">
        <h3><Dumbbell size={16} style={{ verticalAlign: -2 }} /> Training</h3>
        <p className="profile-section-sub">Gym at {profile.gymTime}</p>
        <div className="day-grid" style={{ marginBottom: 16 }}>
          {WEEK_ORDER.map((day) => (
            <button
              key={day}
              type="button"
              className={`day-chip ${profile.gymDays.includes(day) ? 'selected' : ''}`}
              onClick={() => toggleDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="profile-section">
        <h3>How you shop</h3>
        <div className="goal-list">
          {SHOPPING_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`goal-card ${profile.shoppingMode === m.id ? 'selected' : ''}`}
              onClick={() => setProfile({ shoppingMode: m.id })}
            >
              <div>
                <h3 style={{ fontSize: 14 }}>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="profile-section">
        <h3>Weekly budget</h3>
        <div className="goal-list">
          {BUDGET_TIERS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`goal-card ${profile.budgetTier === b.id ? 'selected' : ''}`}
              onClick={() => setProfile({ budgetTier: b.id })}
            >
              <div>
                <h3 style={{ fontSize: 14 }}>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="profile-section">
        <h3><Target size={16} style={{ verticalAlign: -2 }} /> Goal</h3>
        <div className="goal-list">
          {GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`goal-card ${profile.goal === g.id ? 'selected' : ''}`}
              onClick={() => setProfile({ goal: g.id })}
            >
              <div>
                <h3 style={{ fontSize: 14 }}>{g.title}</h3>
                <p>{g.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="btn btn-secondary" style={{ marginTop: 8 }} onClick={resetOnboarding}>
        Reset demo (onboarding)
      </button>
    </div>
  );
}
