import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export function ScreenHeader({ title, subtitle, onBack }: ScreenHeaderProps) {
  const { goBack } = useApp();

  return (
    <div className="screen-header">
      <button
        type="button"
        className="btn-icon"
        onClick={onBack ?? goBack}
        aria-label="Back"
      >
        <ArrowLeft size={18} />
      </button>
      <div className="page-header">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
