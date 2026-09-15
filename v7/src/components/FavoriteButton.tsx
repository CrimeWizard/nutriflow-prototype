import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  active: boolean;
  onToggle: () => void;
  size?: number;
}

export function FavoriteButton({ active, onToggle, size = 20 }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className={`favorite-btn${active ? ' favorite-btn--active' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart size={size} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
}
