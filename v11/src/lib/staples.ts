import { findShopProduct, shopProducts } from '../data/mockData';
import type { Order, ShopProduct } from '../types';

const DEFAULT_STAPLES: { brand: string; name: string }[] = [
  { brand: 'Juhayna', name: 'Light Yogurt' },
  { brand: 'Americana', name: 'Chicken Breast' },
  { brand: 'Fresh', name: 'Bananas' },
  { brand: 'Juhayna', name: 'Fresh Milk' },
  { brand: 'Quaker', name: 'Oats' },
  { brand: 'El Wadi', name: 'White Eggs' },
];

export function hasGroceryOrderHistory(orderHistory: Order[]): boolean {
  return orderHistory.some((o) => o.deliveries.some((d) => d.source === 'supermarket'));
}

export function getStapleProducts(supermarketId: string, orderHistory: Order[]): ShopProduct[] {
  const seen = new Set<string>();
  const result: ShopProduct[] = [];

  const counts: Record<string, number> = {};
  orderHistory.forEach((order) => {
    order.deliveries.forEach((d) => {
      if (d.source !== 'supermarket') return;
      d.items.forEach((item) => {
        counts[item.productId] = (counts[item.productId] ?? 0) + item.quantity;
      });
    });
  });

  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([productId]) => {
      const p = shopProducts.find((x) => x.id === productId && x.supermarketId === supermarketId);
      if (p && !seen.has(p.id)) {
        seen.add(p.id);
        result.push(p);
      }
    });

  DEFAULT_STAPLES.forEach((m) => {
    const p = findShopProduct(supermarketId, m.brand, m.name);
    if (p && !seen.has(p.id)) {
      seen.add(p.id);
      result.push(p);
    }
  });

  return result.slice(0, 8);
}
