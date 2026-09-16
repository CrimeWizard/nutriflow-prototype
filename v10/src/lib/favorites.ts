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

const FAVORITES_KEY = 'nf-v10-favorites';
const LEGACY_FAVORITES_KEYS = ['nf-v8-favorites', 'nf-v9-favorites', 'nf-v7-favorites'];

export function loadFavorites(): Favorite[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw) return JSON.parse(raw) as Favorite[];
    for (const key of LEGACY_FAVORITES_KEYS) {
      const legacy = localStorage.getItem(key);
      if (!legacy) continue;
      const parsed = JSON.parse(legacy) as Favorite[];
      saveFavorites(parsed);
      return parsed;
    }
  } catch { /* empty */ }
  return [];
}

export function saveFavorites(favorites: Favorite[]) {
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); } catch { /* empty */ }
}
