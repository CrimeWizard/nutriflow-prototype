import { useMemo, useState } from 'react';
import {
  ChevronDown, ChevronRight, Package, RotateCcw, ShoppingBasket, Store, UtensilsCrossed,
} from 'lucide-react';
import { FoodImage } from '../components/FoodImage';
import { useApp } from '../context/AppContext';
import { getRecipe, getRestaurant } from '../data/mockData';
import { plannedMealPhoto } from '../lib/foodImages';
import { summarizePlanBudget } from '../lib/planBudget';
import type { PlannedMeal } from '../planning/types';
import {
  budgetLabel, dailyBudgetMax, formatEgp, getTodayKey, isActiveOrder, isGymDay,
  shoppingModeLabel, WEEK_ORDER,
} from '../utils';

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
    openRestaurant, openIngredients, openQuickMealPreview,
    addPlannedWeekToCart, addPlannedMealsToCart,
    orderHistory, setScreen, reorderFromDelivery,
  } = useApp();

  const activeOrders = orderHistory.filter((o) => isActiveOrder(o));

  const groceryReorder = useMemo(() => {
    for (const order of orderHistory) {
      if (order.status !== 'delivered') continue;
      const delivery = order.deliveries.find((d) => d.source === 'supermarket');
      if (delivery) return delivery;
    }
    return null;
  }, [orderHistory]);

  const name = profile.name || 'there';
  const todayKey = getTodayKey();
  const selectedDay = weeklyPlan.days.find((d) => d.dayKey === selectedPlanDay)
    ?? weeklyPlan.days.find((d) => d.isToday)
    ?? weeklyPlan.days[0];
  const gymToday = isGymDay(todayKey, profile.gymDays);
  const { summary } = weeklyPlan;
  const dailyCap = dailyBudgetMax(profile.budgetTier);
  const budget = useMemo(() => summarizePlanBudget(weeklyPlan), [weeklyPlan]);
  const todayDay = weeklyPlan.days.find((d) => d.isToday) ?? weeklyPlan.days[0];
  const todaySpend = todayDay.dayTotal;
  const todayWithinCap = profile.budgetTier === 'flexible' || todaySpend <= dailyCap;
  const [budgetOpen, setBudgetOpen] = useState(false);

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
      openQuickMealPreview(meal);
    }
  };

  const actionLabel = (meal: PlannedMeal) => {
    if (meal.source === 'restaurant') return 'View restaurant';
    if (meal.source === 'recipe') return 'Shop ingredients';
    return 'Preview & add';
  };

  const dayLabel = selectedDay.isToday ? 'Today' : selectedDay.dayKey;

  return (
    <div className="scroll fade-in">
      <div className="page-header">
        <h1>Hey, {name}</h1>
        <p>{profile.area} · {gymToday ? 'Gym day' : 'Rest day'}</p>
      </div>

      {groceryReorder && (
        <button
          type="button"
          className="reorder-banner"
          onClick={() => reorderFromDelivery(groceryReorder)}
        >
          <RotateCcw size={18} />
          <div>
            <strong>Order your staples again</strong>
            <p>{groceryReorder.vendorName} · {groceryReorder.items.length} items</p>
          </div>
          <ChevronRight size={18} />
        </button>
      )}

      {activeOrders.length > 0 && (
        <div className="active-orders-block">
          <p className="section-title" style={{ marginBottom: 10 }}>Current orders</p>
          {activeOrders.map((order) => (
            <button
              key={order.id}
              type="button"
              className="active-order-card"
              onClick={() => setScreen('orders')}
            >
              <div className="active-order-icon">
                <Package size={20} />
              </div>
              <div className="active-order-body">
                <strong>On the way · {order.id}</strong>
                <p>
                  {order.deliveries.length} {order.deliveries.length === 1 ? 'delivery' : 'deliveries'}
                  {' · '}{formatEgp(order.total)} · Pay on delivery
                  {' · '}Demo: auto-completes in ~90s
                </p>
                {order.deliveries.map((d) => (
                  <span key={d.id} className="active-order-eta">
                    {d.vendorName} — {d.eta}
                  </span>
                ))}
              </div>
              <ChevronRight size={18} className="active-order-chevron" />
            </button>
          ))}
        </div>
      )}

      <div className="hero-card">
        <div className="hero-eyebrow">Your week · Sat – Fri</div>
        <h2>
          {summary.gymDaysCount} gym days · ~{summary.avgDailyProtein}g protein/day
        </h2>
        <p className="hero-today-line">
          Today ~{formatEgp(todaySpend)}
          {profile.budgetTier !== 'flexible' && (
            <span className={todayWithinCap ? 'hero-budget-ok' : 'hero-budget-warn'}>
              {' '}· {todayWithinCap ? 'within' : 'above'} ~{formatEgp(dailyCap)} cap
            </span>
          )}
        </p>
        <p className="hero-hint">Tap a meal below to order just one</p>

        <button
          type="button"
          className="hero-budget-toggle"
          onClick={() => setBudgetOpen((o) => !o)}
          aria-expanded={budgetOpen}
        >
          Budget breakdown
          <ChevronDown size={16} className={budgetOpen ? 'hero-chevron-open' : ''} />
        </button>
        {budgetOpen && (
          <div className="hero-budget-panel">
            <div className="hero-budget-rows">
              <div className="hero-budget-row">
                <span>Rest days (avg)</span>
                <strong>~{formatEgp(budget.avgRestDay)}/day</strong>
              </div>
              <div className="hero-budget-row">
                <span>Gym days (avg)</span>
                <strong>~{formatEgp(budget.avgGymDay)}/day</strong>
              </div>
            </div>
            <p className="hero-budget-note">
              {budgetLabel(profile.budgetTier)} · {shoppingModeLabel(profile.shoppingMode)}
              {gymToday ? ` · Gym at ${profile.gymTime}` : ''} — guide only, not a bill
            </p>
          </div>
        )}
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
              <div className={`meal-icon-wrap meal-photo-wrap ${meal.type === 'pre-workout' ? 'pre' : meal.type === 'post-workout' ? 'post' : ''}`}>
                <FoodImage
                  src={plannedMealPhoto(meal)}
                  fallback={meal.image ?? '🍽️'}
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

      <p className="cta-hint cta-hint-primary">
        {selectedDay.dayProtein}g protein · ~{formatEgp(selectedDay.dayTotal)} planned for {dayLabel.toLowerCase()}
      </p>

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
      <p className="cta-hint">Most people shop 1–2 days at a time · cart groups by vendor</p>
    </div>
  );
}
