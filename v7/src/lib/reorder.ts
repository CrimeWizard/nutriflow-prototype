import type { CartItem, DeliveryGroup } from '../types';

export type CartItemInput = Omit<CartItem, 'cartLineId' | 'quantity'>;

export function cartItemsToInput(items: CartItem[]): CartItemInput[] {
  return items.map((item) => ({
    productId: item.productId,
    name: item.name,
    brand: item.brand,
    size: item.size,
    price: item.price,
    image: item.image,
    source: item.source,
    vendorName: item.vendorName,
    fromRecipe: item.fromRecipe,
  }));
}

export function reorderDelivery(delivery: DeliveryGroup): CartItemInput[] {
  return cartItemsToInput(delivery.items);
}

export function reorderOrder(deliveries: DeliveryGroup[]): CartItemInput[] {
  return deliveries.flatMap((d) => cartItemsToInput(d.items));
}
