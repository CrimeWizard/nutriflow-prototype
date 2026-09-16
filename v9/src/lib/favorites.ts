import type { Favorite, FavoriteKind } from '../types';

export function favoriteKey(kind: FavoriteKind, id: string): string {
  return `${kind}:${id}`;
}

export function mealFavoriteKey(restaurantId: string, mealId: string): string {
  return favoriteKey('meal', `${restaurantId}:${mealId}`);
}

export function recipeFavoriteKey(recipeId: string): string {
  return favoriteKey('recipe', recipeId);
}

export function productFavoriteKey(productId: string): string {
  return favoriteKey('product', productId);
}

export function loadFavorites(): Favorite[] {
  try {
    const raw = localStorage.getItem('nf-v8-favorites');
    if (raw) return JSON.parse(raw) as Favorite[];
  } catch { /* empty */ }
  return [];
}

export function saveFavorites(favorites: Favorite[]) {
  try { localStorage.setItem('nf-v8-favorites', JSON.stringify(favorites)); } catch { /* empty */ }
}
