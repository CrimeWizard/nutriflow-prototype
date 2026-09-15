import { Dumbbell, Target, User } from 'lucide-react';
import { DELIVERY_AREAS, GOALS, WEEKDAYS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { formatEgp, goalLabel } from '../utils';

export function Profile() {
  const { profile, setProfile, orderHistory, resetOnboarding } = useApp();

  const toggleDay = (day: string) => {
    const days = profile.gymDays.includes(day)
      ? profile.gymDays.filter((d) => d !== day)
      : [...profile.gymDays, day];
    setProfile({ gymDays: days });
  };

  return (
    <div className="scroll fade-in">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Your details & preferences</p>
      </div>

      <div className="profile-avatar">
        <div className="profile-avatar-circle">
          <User size={28} />
        </div>
        <h2>{profile.name || 'Your name'}</h2>
        <p>{profile.area} · {goalLabel(profile.goal)}</p>
      </div>

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
          {WEEKDAYS.map((day) => (
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

      {orderHistory.length > 0 && (
        <div className="profile-section">
          <h3>Recent orders</h3>
          {orderHistory.slice(0, 3).map((order) => (
            <div key={order.id} className="order-history-item">
              <div>
                <strong>{order.id}</strong>
                <p>{order.items.length} items · {formatEgp(order.total)}</p>
              </div>
              <span className="order-history-date">Pay on delivery</span>
            </div>
          ))}
        </div>
      )}

      <button type="button" className="btn btn-secondary" style={{ marginTop: 8 }} onClick={resetOnboarding}>
        Reset demo (onboarding)
      </button>
    </div>
  );
}
