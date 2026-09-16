import { findShopProduct } from '../data/mockData';
import type { Recipe, RecipeIngredient } from '../types';

export function ingredientOptionsForSupermarket(
  ing: RecipeIngredient,
  supermarketId: string,
) {
  return ing.options.filter((opt) => findShopProduct(supermarketId, opt.brand, opt.name));
}

export function defaultIngredientOptionId(ing: RecipeIngredient, supermarketId: string): string {
  const available = ingredientOptionsForSupermarket(ing, supermarketId);
  if (available.length === 0) return ing.defaultOptionId;
  const preferred = available.find((o) => o.id === ing.defaultOptionId);
  return preferred?.id ?? available[0].id;
}

export function defaultSelectionsForRecipe(recipe: Recipe, supermarketId: string): Record<string, string> {
  const defaults: Record<string, string> = {};
  recipe.ingredients.forEach((ing) => {
    defaults[ing.id] = defaultIngredientOptionId(ing, supermarketId);
  });
  return defaults;
}
