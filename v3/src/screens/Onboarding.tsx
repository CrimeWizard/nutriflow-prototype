import { ArrowLeft, Check, Dumbbell, Target, TrendingDown, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DELIVERY_AREAS, GYM_TIMES, GOALS, WEEKDAYS } from '../data/mockData';

const GOAL_ICONS = {
  cut: TrendingDown,
  maintain: Target,
  bulk: TrendingUp,
};

export function Onboarding() {
  const {
    profile, setProfile, onboardingStep, setOnboardingStep, completeOnboarding,
  } = useApp();

  const totalSteps = 4;

  const toggleDay = (day: string) => {
    const days = profile.gymDays.includes(day)
      ? profile.gymDays.filter((d) => d !== day)
      : [...profile.gymDays, day];
    setProfile({ gymDays: days });
  };

  const canContinue = () => {
    if (onboardingStep === 1) return profile.gymDays.length > 0;
    if (onboardingStep === 2) return true;
    if (onboardingStep === 3) {
      return profile.name.trim().length >= 2
        && profile.phone.length >= 10
        && profile.area.length > 0;
    }
    return true;
  };

  const next = () => {
    if (onboardingStep < totalSteps - 1) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const back = () => {
    if (onboardingStep > 0) setOnboardingStep(onboardingStep - 1);
  };

  return (
    <div className="onboarding">
      <div className="onboarding-body fade-in">
        {onboardingStep > 0 && (
          <div className="step-dots">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`step-dot ${s < onboardingStep ? 'done' : ''} ${s === onboardingStep ? 'active' : ''}`}
              />
            ))}
          </div>
        )}

        {onboardingStep === 0 && (
          <div className="welcome-hero">
            <div className="welcome-icon">
              <Dumbbell size={32} />
            </div>
            <h1>Eat for your training</h1>
            <p>
              We plan your meals around gym days and fill your cart with real supermarket products. No daily logging.
            </p>
          </div>
        )}

        {onboardingStep === 1 && (
          <>
            <h2 className="ob-title">When do you train?</h2>
            <p className="ob-sub">Tap your gym days. We&apos;ll time your meals around them.</p>
            <div className="day-grid">
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
            <p className="section-title" style={{ marginTop: 8 }}>Usual gym time</p>
            <div className="time-row">
              {GYM_TIMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`time-chip ${profile.gymTime === t ? 'selected' : ''}`}
                  onClick={() => setProfile({ gymTime: t })}
                >
                  {t}
                </button>
              ))}
            </div>
          </>
        )}

        {onboardingStep === 2 && (
          <>
            <h2 className="ob-title">What&apos;s your goal?</h2>
            <p className="ob-sub">We&apos;ll adjust portions and meal picks — you never have to calculate macros.</p>
            <div className="goal-list">
              {GOALS.map((g) => {
                const Icon = GOAL_ICONS[g.id];
                const selected = profile.goal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    className={`goal-card ${selected ? 'selected' : ''}`}
                    onClick={() => setProfile({ goal: g.id })}
                  >
                    <div className="goal-card-icon">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3>{g.title}</h3>
                      <p>{g.desc}</p>
                    </div>
                    <div className="goal-check">
                      {selected && <Check size={12} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {onboardingStep === 3 && (
          <>
            <h2 className="ob-title">Where should we deliver?</h2>
            <p className="ob-sub">Quick details — then you&apos;ll see today&apos;s meals ready to order.</p>

            <div className="field">
              <label className="field-label" htmlFor="name">Your name</label>
              <input
                id="name"
                placeholder="Youssef"
                value={profile.name}
                onChange={(e) => setProfile({ name: e.target.value })}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="phone">Phone number</label>
              <input
                id="phone"
                type="tel"
                placeholder="01xxxxxxxxx"
                value={profile.phone}
                onChange={(e) => setProfile({ phone: e.target.value })}
              />
            </div>

            <p className="section-title">Area</p>
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

            <div className="field">
              <label className="field-label" htmlFor="address">Building / street (optional)</label>
              <input
                id="address"
                placeholder="e.g. Building 5, Street 90"
                value={profile.address}
                onChange={(e) => setProfile({ address: e.target.value })}
              />
            </div>
          </>
        )}
      </div>

      <div className="onboarding-footer">
        {onboardingStep === 0 ? (
          <button type="button" className="btn btn-primary" onClick={next}>
            Get started
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-icon" onClick={back} aria-label="Back">
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={next}
              disabled={!canContinue()}
            >
              {onboardingStep === 3 ? 'See my meals' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
