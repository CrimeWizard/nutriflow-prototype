import { shopProducts } from '../data/mockData';
import type { Favorite } from '../types';
import { mealPhoto, recipePhoto } from './foodImages';
import { productPhoto } from './productImages';

export function favoritePhotoUrl(fav: Favorite): string | null {
  if (fav.photoUrl) return fav.photoUrl;
  if (fav.kind === 'meal' && fav.mealId) return mealPhoto(fav.mealId);
  if (fav.kind === 'recipe' && fav.recipeId) return recipePhoto(fav.recipeId);
  if (fav.kind === 'product' && fav.productId) {
    const product = shopProducts.find((item) => item.id === fav.productId);
    return product ? productPhoto(product) : null;
  }
  return null;
}
