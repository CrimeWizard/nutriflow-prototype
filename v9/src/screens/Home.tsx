import { useMemo, useState } from 'react';
import {
  Apple, ChevronDown, ChevronRight, Flame, Package, Pill, RotateCcw, Sparkles, UserRoundCheck, UtensilsCrossed,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { summarizePlanBudget } from '../lib/planBudget';
import {
  budgetLabel, dailyBudgetMax, formatEgp, getTodayKey, isActiveOrder, isGymDay,
  shoppingModeLabel,
} from '../utils';

const HOME_ACTIONS = [
  { label: 'Groceries', icon: Apple, screen: 'groceries' as const },
  { label: 'Eat out', icon: UtensilsCrossed, screen: 'restaurants' as const },
  { label: 'Supplements', icon: Pill, screen: 'supplements' as const },
  { label: "Today's plan", icon: UserRoundCheck, screen: 'today-plan' as const },
];

export function Home() {
  const {
    profile, weeklyPlan, orderHistory, setScreen, reorderFromDelivery, reorderFromOrder,
  } = useApp();
  const activeOrders = orderHistory.filter((o) => isActiveOrder(o));
  const [budgetOpen, setBudgetOpen] = useState(false);

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
  const gymToday = isGymDay(todayKey, profile.gymDays);
  const { summary } = weeklyPlan;
  const dailyCap = dailyBudgetMax(profile.budgetTier);
  const budget = useMemo(() => summarizePlanBudget(weeklyPlan), [weeklyPlan]);
  const todayDay = weeklyPlan.days.find((d) => d.isToday) ?? weeklyPlan.days[0];
  const todaySpend = todayDay.dayTotal;
  const todayWithinCap = profile.budgetTier === 'flexible' || todaySpend <= dailyCap;
  const lastDeliveredOrder = orderHistory.find((order) => order.status === 'delivered');

  return (
    <div className="scroll fade-in">
      <div className="page-header">
        <h1>Hey, {name}</h1>
        <p>{profile.area} · {gymToday ? 'Gym day' : 'Rest day'}</p>
      </div>

      <div className="home-action-grid">
        {HOME_ACTIONS.map(({ label, icon: Icon, screen }) => (
          <button
            key={label}
            type="button"
            className="home-action-tile"
            onClick={() => setScreen(screen)}
          >
            <span className="home-action-icon">
              <Icon size={22} strokeWidth={1.75} />
            </span>
            <span className="home-action-label">{label}</span>
          </button>
        ))}
      </div>

      <section className="home-strip-section">
        <div className="home-section-head">
          <h2>Reorder</h2>
          <button type="button" onClick={() => setScreen('orders')}>View orders</button>
        </div>
        <div className="home-mini-grid">
          {groceryReorder ? (
            <button
              type="button"
              className="home-mini-card"
              onClick={() => reorderFromDelivery(groceryReorder)}
            >
              <RotateCcw size={18} />
              <strong>Staples again</strong>
              <span>{groceryReorder.vendorName} · {groceryReorder.items.length} items</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="home-mini-card"
              onClick={() => setScreen('groceries')}
            >
              <RotateCcw size={18} />
              <strong>Build staples</strong>
              <span>Start a grocery order</span>
              <ChevronRight size={16} />
            </button>
          )}
          {lastDeliveredOrder ? (
            <button
              type="button"
              className="home-mini-card"
              onClick={() => reorderFromOrder(lastDeliveredOrder)}
            >
              <Package size={18} />
              <strong>Last order</strong>
              <span>{formatEgp(lastDeliveredOrder.total)} · order again</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="home-mini-card"
              onClick={() => setScreen('today-plan')}
            >
              <Package size={18} />
              <strong>Today's plan</strong>
              <span>Add meals from Plan</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </section>

      <section className="home-strip-section">
        <div className="home-section-head">
          <h2>Don't miss out</h2>
        </div>
        <div className="home-mini-grid">
          <button
            type="button"
            className="home-mini-card accent"
            onClick={() => setScreen('supplements')}
          >
            <Sparkles size={18} />
            <strong>Training stack</strong>
            <span>Whey, creatine, omega-3</span>
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            className="home-mini-card accent"
            onClick={() => setScreen('restaurants')}
          >
            <Flame size={18} />
            <strong>High-protein picks</strong>
            <span>Healthy meals near you</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

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
        <div className="hero-eyebrow">Your week · Sat-Fri</div>
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
        <button
          type="button"
          className="hero-plan-link"
          onClick={() => setScreen('today-plan')}
        >
          View today's plan
          <ChevronRight size={16} />
        </button>

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
    </div>
  );
}
