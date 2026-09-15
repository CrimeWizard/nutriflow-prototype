import { restaurants } from './data/mockData';
import type { CartItem, CartSource, DeliveryGroup } from './types';

export function cartLineKey(item: Pick<CartItem, 'source' | 'vendorName' | 'productId' | 'fromRecipe'>): string {
  return `${item.source}:${item.vendorName}:${item.productId}:${item.fromRecipe ?? ''}`;
}

export function newCartLineId(): string {
  return `cl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function lineTotal(item: CartItem): number {
  return item.price * item.quantity;
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((s, i) => s + lineTotal(i), 0);
}

export function groupKey(source: CartSource, vendorName: string): string {
  return `${source}:${vendorName}`;
}

export function parseGroupKey(key: string): { source: CartSource; vendorName: string } {
  const idx = key.indexOf(':');
  return {
    source: key.slice(0, idx) as CartSource,
    vendorName: key.slice(idx + 1),
  };
}

export function groupCartItems(items: CartItem[]): Map<string, CartItem[]> {
  const groups = new Map<string, CartItem[]>();
  items.forEach((item) => {
    const key = groupKey(item.source, item.vendorName);
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  });
  return groups;
}

function etaForVendor(source: CartSource, vendorName: string): string {
  if (source === 'restaurant') {
    const r = restaurants.find((x) => x.name === vendorName);
    return `Today, ${r?.deliveryMins ?? '45–60 min'}`;
  }
  const sm = vendorName;
  return `Tomorrow, 9:00–11:00am · ${sm}`;
}

export function buildDeliveryGroups(items: CartItem[]): DeliveryGroup[] {
  const grouped = groupCartItems(items);
  return Array.from(grouped.entries()).map(([key, groupItems]) => {
    const { source, vendorName } = parseGroupKey(key);
    return {
      id: `del-${key}`,
      vendorName,
      source,
      items: groupItems,
      subtotal: groupItems.reduce((s, i) => s + lineTotal(i), 0),
      eta: etaForVendor(source, vendorName),
    };
  });
}

export function countCartItems(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.quantity, 0);
}
