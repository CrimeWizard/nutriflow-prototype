import { Minus, Plus } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';
import { FoodImage } from './FoodImage';
import { productPhoto } from '../lib/productImages';
import { formatEgp } from '../utils';
import type { ShopProduct } from '../types';

interface GroceryProductCardProps {
  product: ShopProduct;
  qty: number;
  favoriteActive: boolean;
  onToggleFavorite: () => void;
  onAdd: (toastOnFirst?: boolean) => void;
  onDecrement: () => void;
  variant?: 'grid' | 'staple';
}

export function GroceryProductCard({
  product,
  qty,
  favoriteActive,
  onToggleFavorite,
  onAdd,
  onDecrement,
  variant = 'grid',
}: GroceryProductCardProps) {
  const inCart = qty > 0;

  const renderAction = () => {
    if (inCart) {
      return (
        <div className="grocery-card__stepper" role="group" aria-label={`Quantity for ${product.name}`}>
          <button
            type="button"
            className="grocery-card__stepper-btn grocery-card__stepper-btn--minus"
            onClick={onDecrement}
            aria-label={`Decrease ${product.name}`}
          >
            <Minus size={14} strokeWidth={2.5} />
          </button>
          <span className="grocery-card__stepper-value" aria-live="polite">{qty}</span>
          <button
            type="button"
            className="grocery-card__stepper-btn"
            onClick={() => onAdd(false)}
            aria-label={`Increase ${product.name}`}
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        className="grocery-card__add"
        onClick={() => onAdd(true)}
        aria-label={`Add ${product.name}`}
      >
        <Plus size={16} strokeWidth={2.5} />
      </button>
    );
  };

  return (
    <article
      className={`grocery-card grocery-card--${variant}${inCart ? ' grocery-card--in-cart' : ''}`}
    >
      <div className="grocery-card__media">
        <FoodImage
          src={productPhoto(product)}
          fallback={product.image}
          alt=""
          className="grocery-card__img"
        />
        <FavoriteButton
          active={favoriteActive}
          onToggle={onToggleFavorite}
          size={variant === 'staple' ? 12 : 14}
        />
      </div>

      <div className="grocery-card__body">
        <span className="grocery-card__brand">{product.brand}</span>
        <h4 className="grocery-card__name">{product.name}</h4>
        <p className="grocery-card__size">{product.size}</p>
        <div className="grocery-card__footer">
          <span className="grocery-card__price">{formatEgp(product.price)}</span>
          {renderAction()}
        </div>
      </div>
    </article>
  );
}
