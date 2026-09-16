import { useEffect, useRef, useState } from 'react';
import { Leaf } from 'lucide-react';

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setPhase('out'), 1500);
    const doneTimer = window.setTimeout(() => onDoneRef.current(), 2100);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div className={`splash-screen ${phase === 'out' ? 'splash-screen--out' : ''}`} aria-hidden="true">
      <div className="splash-content">
        <div className="splash-logo-mark">
          <Leaf size={36} strokeWidth={1.75} />
        </div>
        <div className="splash-wordmark">
          Nutri<span>Flow</span>
        </div>
        <p className="splash-tagline">Eat for your training</p>
      </div>
    </div>
  );
}
