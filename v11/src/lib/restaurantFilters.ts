import type { Restaurant } from '../types';

export type RestaurantFilter = 'all' | 'high-protein' | 'meal-prep' | 'breakfast';

export const RESTAURANT_FILTERS: { id: RestaurantFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'high-protein', label: 'High protein' },
  { id: 'meal-prep', label: 'Meal prep' },
  { id: 'breakfast', label: 'Breakfast' },
];

export function restaurantMatchesFilter(restaurant: Restaurant, filter: RestaurantFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'high-protein') {
    return restaurant.tags.includes('high-protein')
      || restaurant.meals.some((m) => m.protein >= 30 || m.tags.includes('high-protein'));
  }
  if (filter === 'meal-prep') {
    return restaurant.tags.includes('meal-prep')
      || restaurant.meals.some((m) => m.tags.includes('meal-prep'));
  }
  if (filter === 'breakfast') {
    return restaurant.meals.some((m) => m.tags.includes('breakfast'));
  }
  return true;
}
