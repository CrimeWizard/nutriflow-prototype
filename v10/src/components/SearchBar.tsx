import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  compact?: boolean;
}

export function SearchBar({ value, onChange, placeholder = 'Search…', compact = false }: SearchBarProps) {
  return (
    <div className={`search-bar${compact ? ' search-bar--compact' : ''}`}>
      <Search size={compact ? 16 : 18} className="search-bar-icon" />
      <input
        type="search"
        className="search-bar-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="search-bar-clear" onClick={() => onChange('')} aria-label="Clear">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
