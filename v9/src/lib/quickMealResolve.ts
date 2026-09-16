import { findShopProduct, getQuickMeal, getRestaurant, getSupermarket } from '../data/mockData';
import type { CartItem, UserProfile } from '../types';

export type CartItemInput = Omit<CartItem, 'cartLineId' | 'quantity'>;

export interface ResolvedQuickLine {
  label: string;
  price: number;
  source: 'restaurant' | 'supermarket';
  vendorName: string;
}

export interface ResolvedQuickMeal {
  items: CartItemInput[];
  lines: ResolvedQuickLine[];
  unavailable: string[];
  total: number;
}

export function resolveQuickMeal(
  quickMealId: string,
  profile: UserProfile,
  supermarketId: string,
): ResolvedQuickMeal | null {
  const quick = getQuickMeal(quickMealId);
  if (!quick) return null;

  const supermarket = getSupermarket(supermarketId);
  const supermarketName = supermarket?.name ?? 'Carrefour';
  const items: CartItemInput[] = [];
  const lines: ResolvedQuickLine[] = [];
  const unavailable: string[] = [];

  quick.matchers.forEach((matcher) => {
    if (matcher.restaurantId && matcher.restaurantMealId) {
      const r = getRestaurant(matcher.restaurantId);
      if (!r) {
        unavailable.push(`${matcher.brand} ${matcher.name}`);
        return;
      }
      if (r.area !== profile.area) {
        unavailable.push(`${matcher.name} — not in ${profile.area}`);
        return;
      }
      const m = r.meals.find((x) => x.id === matcher.restaurantMealId);
      if (!m) {
        unavailable.push(`${matcher.name}`);
        return;
      }
      items.push({
        productId: m.id,
        name: m.name,
        price: m.price,
        image: m.image,
        source: 'restaurant',
        vendorName: r.name,
      });
      lines.push({
        label: m.name,
        price: m.price,
        source: 'restaurant',
        vendorName: r.name,
      });
      return;
    }

    const p = findShopProduct(supermarketId, matcher.brand, matcher.name);
    if (!p) {
      unavailable.push(`${matcher.brand} ${matcher.name}`);
      return;
    }
    items.push({
      productId: p.id,
      brand: p.brand,
      name: p.name,
      size: p.size,
      price: p.price,
      image: p.image,
      source: 'supermarket',
      vendorName: supermarketName,
    });
    lines.push({
      label: `${p.brand} ${p.name}`,
      price: p.price,
      source: 'supermarket',
      vendorName: supermarketName,
    });
  });

  const total = lines.reduce((s, l) => s + l.price, 0);
  return { items, lines, unavailable, total };
}
