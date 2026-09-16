import { supermarkets } from '../data/mockData';

interface SupermarketPickerProps {
  selectedId: string;
  onSelect: (id: string) => void;
  title?: string;
  showTitle?: boolean;
}

export function SupermarketPicker({
  selectedId,
  onSelect,
  title = 'Choose supermarket',
  showTitle = true,
}: SupermarketPickerProps) {
  return (
    <div className={`supermarket-picker${showTitle ? '' : ' supermarket-picker--compact'}`}>
      {showTitle && <p className="section-title">{title}</p>}
      <div className="supermarket-strip">
        {supermarkets.map((sm) => (
          <button
            key={sm.id}
            type="button"
            className={`supermarket-card ${selectedId === sm.id ? 'selected' : ''}`}
            onClick={() => onSelect(sm.id)}
          >
            <span className="supermarket-card-emoji">{sm.image}</span>
            <span className="supermarket-card-name">{sm.name}</span>
            <span className="supermarket-card-meta">{sm.deliveryMins}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
