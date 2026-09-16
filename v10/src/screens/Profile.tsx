import {
  ChevronRight, Dumbbell, Package, Target, User,
} from 'lucide-react';
import { BUDGET_TIERS, DELIVERY_AREAS, GOALS, SHOPPING_MODES } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { goalLabel, isActiveOrder, WEEK_ORDER } from '../utils';

export function Profile() {
  const {
    profile, setProfile, orderHistory, resetOnboarding, setScreen,
  } = useApp();

  const toggleDay = (day: string) => {
    const days = profile.gymDays.includes(day)
      ? profile.gymDays.filter((d) => d !== day)
      : [...profile.gymDays, day];
    setProfile({ gymDays: days });
  };

  const activeOrders = orderHistory.filter((o) => isActiveOrder(o));

  return (
    <div className="scroll fade-in">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Orders & settings</p>
      </div>

      <div className="profile-avatar">
        <div className="profile-avatar-circle">
          <User size={28} />
        </div>
        <h2>{profile.name || 'Your name'}</h2>
        <p>{profile.area} · {goalLabel(profile.goal)}</p>
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
