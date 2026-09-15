import { Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function TopBar({ showSettings = false }: { showSettings?: boolean }) {
  const { resetOnboarding } = useApp();

  return (
    <header className="topbar">
      <div className="logo">Nutri<span>Flow</span></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="badge">v3 · Egypt</span>
        {showSettings && (
          <button
            type="button"
            className="btn-icon"
            onClick={resetOnboarding}
            aria-label="Reset demo"
            title="Reset onboarding (demo)"
          >
            <Settings size={16} />
          </button>
        )}
      </div>
    </header>
  );
}
