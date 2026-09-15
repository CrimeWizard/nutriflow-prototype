import type {
  ProductCategory, QuickMeal, Recipe, Restaurant, ShopProduct, Supermarket,
} from '../types';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Dairy', 'Meat', 'Grains', 'Produce', 'Pantry',
];

export const supermarkets: Supermarket[] = [
  {
    id: 'sm-carrefour',
    name: 'Carrefour',
    image: '🛒',
    deliveryMins: '45–60 min',
    tagline: 'Wide selection',
  },
  {
    id: 'sm-spinneys',
    name: 'Spinneys',
    image: '🏪',
    deliveryMins: '50–65 min',
    tagline: 'Premium groceries',
  },
  {
    id: 'sm-metro',
    name: 'Metro Market',
    image: '🏬',
    deliveryMins: '40–55 min',
    tagline: 'Great value',
  },
  {
    id: 'sm-seoudi',
    name: 'Seoudi',
    image: '🥬',
    deliveryMins: '35–50 min',
    tagline: 'Fresh & local',
  },
];

export const DELIVERY_AREAS = [
  'New Cairo', 'Maadi', '6th of October', 'Sheikh Zayed', 'Nasr City', 'Heliopolis',
] as const;

export const GYM_TIMES = [
  '06:00', '07:00', '08:00', '12:00', '17:00', '18:00', '19:00', '20:00', '21:00',
] as const;

export const GOALS = [
  { id: 'cut' as const, title: 'Lose weight', desc: 'Lighter meals, still enough protein' },
  { id: 'maintain' as const, title: 'Stay fit', desc: 'Balanced eating around training' },
  { id: 'bulk' as const, title: 'Build muscle', desc: 'Higher protein, bigger portions' },
];

export const restaurants: Restaurant[] = [
  {
    id: 'rest-green-bite',
    name: 'Green Bite',
    area: 'New Cairo',
    cuisine: 'Healthy bowls',
    deliveryMins: '35–45 min',
    rating: 4.7,
    tags: ['high-protein', 'meal-prep'],
    image: '🥗',
    meals: [
      { id: 'gb-1', name: 'Grilled Chicken Bowl', description: 'Brown rice, grilled chicken, avocado, greens', price: 185, protein: 42, calories: 480, image: '🍗', tags: ['bestseller'] },
      { id: 'gb-2', name: 'Salmon Power Bowl', description: 'Quinoa, salmon, edamame, sesame dressing', price: 220, protein: 35, calories: 420, image: '🐟', tags: ['omega-3'] },
      { id: 'gb-3', name: 'Turkey Protein Wrap', description: 'Whole wheat wrap, turkey, hummus, salad', price: 145, protein: 32, calories: 380, image: '🌯', tags: ['lunch'] },
      { id: 'gb-4', name: 'Greek Yogurt Parfait', description: 'Almarai yogurt, berries, granola, honey', price: 95, protein: 18, calories: 280, image: '🥣', tags: ['breakfast'] },
    ],
  },
  {
    id: 'rest-fresh-wave',
    name: 'Fresh Wave',
    area: 'Maadi',
    cuisine: 'Poke & seafood',
    deliveryMins: '40–50 min',
    rating: 4.5,
    tags: ['seafood', 'fresh'],
    image: '🍱',
    meals: [
      { id: 'fw-1', name: 'Tuna Poke Bowl', description: 'Sushi rice, tuna, cucumber, spicy mayo', price: 210, protein: 38, calories: 410, image: '🍣', tags: ['high-protein'] },
      { id: 'fw-2', name: 'Shrimp Avocado Bowl', description: 'Mixed greens, shrimp, avocado, lime', price: 195, protein: 30, calories: 360, image: '🦐', tags: ['low-carb'] },
      { id: 'fw-3', name: 'Miso Salmon Plate', description: 'Grilled salmon, steamed veggies, miso glaze', price: 245, protein: 36, calories: 390, image: '🐟', tags: ['dinner'] },
    ],
  },
  {
    id: 'rest-fit-kitchen',
    name: 'Fit Kitchen',
    area: 'Sheikh Zayed',
    cuisine: 'Protein-focused',
    deliveryMins: '30–40 min',
    rating: 4.8,
    tags: ['gym-friendly', 'high-protein'],
    image: '💪',
    meals: [
      { id: 'fk-1', name: 'Protein Pancakes', description: 'Oat pancakes, whey drizzle, banana', price: 120, protein: 28, calories: 350, image: '🥞', tags: ['breakfast', 'sweet'] },
      { id: 'fk-2', name: 'Double Chicken Plate', description: '200g chicken, sweet potato, broccoli', price: 175, protein: 48, calories: 440, image: '🍗', tags: ['post-workout'] },
      { id: 'fk-3', name: 'Egg White Omelette', description: '4 egg whites, spinach, feta, toast', price: 110, protein: 26, calories: 290, image: '🥚', tags: ['breakfast'] },
    ],
  },
  {
    id: 'rest-lean-clean',
    name: 'Lean & Clean',
    area: 'New Cairo',
    cuisine: 'Meal prep kitchen',
    deliveryMins: '45–55 min',
    rating: 4.6,
    tags: ['meal-prep', 'weekly-plan'],
    image: '📦',
    meals: [
      { id: 'lc-1', name: 'Weekly Prep Box (5 meals)', description: 'Rotating high-protein meals, 5 containers', price: 650, protein: 40, calories: 450, image: '📦', tags: ['meal-prep'] },
      { id: 'lc-2', name: 'Beef & Rice Box', description: 'Lean beef, brown rice, roasted peppers', price: 165, protein: 36, calories: 420, image: '🥩', tags: ['high-protein'] },
      { id: 'lc-3', name: 'Veggie Protein Bowl', description: 'Tofu, chickpeas, tahini, roasted veg', price: 140, protein: 22, calories: 380, image: '🥬', tags: ['vegetarian'] },
    ],
  },
  {
    id: 'rest-nourish',
    name: 'Nourish Lab',
    area: 'Heliopolis',
    cuisine: 'Salads & wraps',
    deliveryMins: '35–45 min',
    rating: 4.4,
    tags: ['salads', 'light'],
    image: '🥬',
    meals: [
      { id: 'nl-1', name: 'Caesar Protein Salad', description: 'Romaine, grilled chicken, light caesar', price: 135, protein: 34, calories: 320, image: '🥗', tags: ['lunch'] },
      { id: 'nl-2', name: 'Quinoa Buddha Bowl', description: 'Quinoa, falafel, tahini, pickled veg', price: 125, protein: 18, calories: 400, image: '🥙', tags: ['vegetarian'] },
      { id: 'nl-3', name: 'Protein Smoothie', description: 'Whey, banana, peanut butter, oats', price: 85, protein: 30, calories: 310, image: '🥤', tags: ['snack'] },
    ],
  },
];

export const recipes: Recipe[] = [
  {
    id: 'r1',
    name: 'Chicken Rice Bowl',
    time: '25 min',
    servings: 2,
    image: '🍲',
    tags: ['high-protein', 'meal-prep'],
    ingredients: [
      {
        id: 'yogurt', name: 'Yogurt', amount: '~200g', defaultOptionId: 'yog-almarai-500',
        options: [
          { id: 'yog-almarai-500', brand: 'Almarai', name: 'Greek Yogurt 0%', size: '500g', price: 42, image: '🥛' },
          { id: 'yog-juhayna-400', brand: 'Juhayna', name: 'Light Yogurt', size: '400g', price: 28, image: '🥛' },
        ],
      },
      {
        id: 'chicken', name: 'Chicken breast', amount: '~300g', defaultOptionId: 'chk-half',
        options: [
          { id: 'chk-half', brand: 'Americana', name: 'Chicken Breast', size: '½ kg', price: 98, image: '🍗' },
          { id: 'chk-quarter', brand: 'Americana', name: 'Chicken Breast', size: '¼ kg', price: 55, image: '🍗' },
        ],
      },
      {
        id: 'rice', name: 'Rice', amount: '150g dry', defaultOptionId: 'rice-brown-1kg',
        options: [
          { id: 'rice-brown-1kg', brand: "Uncle Ben's", name: 'Brown Rice', size: '1 kg', price: 68, image: '🍚' },
          { id: 'rice-white-1kg', brand: 'Al Doha', name: 'Egyptian Rice', size: '1 kg', price: 35, image: '🍚' },
        ],
      },
    ],
  },
  {
    id: 'r2',
    name: 'Berry Protein Oats',
    time: '10 min',
    servings: 1,
    image: '🥣',
    tags: ['breakfast'],
    ingredients: [
      {
        id: 'oats', name: 'Oats', amount: '1 serving', defaultOptionId: 'oats-quaker',
        options: [
          { id: 'oats-quaker', brand: 'Quaker', name: 'Oats', size: '500g', price: 48, image: '🥣' },
        ],
      },
      {
        id: 'yogurt2', name: 'Yogurt', amount: '150g', defaultOptionId: 'yog-juhayna-400',
        options: [
          { id: 'yog-juhayna-400', brand: 'Juhayna', name: 'Light Yogurt', size: '400g', price: 28, image: '🥛' },
        ],
      },
    ],
  },
];

export const quickMeals: QuickMeal[] = [
  {
    id: 'quick-banana-yogurt',
    title: 'Banana + Juhayna yogurt',
    image: '🍌',
    estimatedPrice: 46,
    protein: 8,
    calories: 200,
    matchers: [
      { brand: 'Fresh', name: 'Bananas' },
      { brand: 'Juhayna', name: 'Light Yogurt' },
    ],
  },
  {
    id: 'quick-protein-smoothie',
    title: 'Protein Smoothie',
    image: '🥤',
    estimatedPrice: 85,
    protein: 30,
    calories: 310,
    matchers: [{ brand: 'Nourish Lab', name: 'Protein Smoothie', restaurantMealId: 'nl-3', restaurantId: 'rest-nourish' }],
  },
];

export const shopProducts: ShopProduct[] = [
  // Carrefour
  { id: 'cf-1', supermarketId: 'sm-carrefour', name: 'Greek Yogurt 0%', brand: 'Almarai', category: 'Dairy', price: 42, size: '500g', image: '🥛' },
  { id: 'cf-2', supermarketId: 'sm-carrefour', name: 'Light Yogurt', brand: 'Juhayna', category: 'Dairy', price: 28, size: '400g', image: '🥛' },
  { id: 'cf-3', supermarketId: 'sm-carrefour', name: 'Chicken Breast', brand: 'Americana', category: 'Meat', price: 98, size: '½ kg', image: '🍗' },
  { id: 'cf-4', supermarketId: 'sm-carrefour', name: 'Brown Rice', brand: "Uncle Ben's", category: 'Grains', price: 68, size: '1 kg', image: '🍚' },
  { id: 'cf-5', supermarketId: 'sm-carrefour', name: 'White Eggs', brand: 'El Wadi', category: 'Dairy', price: 62, size: '15 pack', image: '🥚' },
  { id: 'cf-6', supermarketId: 'sm-carrefour', name: 'Avocado', brand: 'Fresh', category: 'Produce', price: 25, size: '1 pc', image: '🥑' },
  { id: 'cf-7', supermarketId: 'sm-carrefour', name: 'Oats', brand: 'Quaker', category: 'Grains', price: 48, size: '500g', image: '🥣' },
  { id: 'cf-8', supermarketId: 'sm-carrefour', name: 'Olive Oil', brand: 'Crystal', category: 'Pantry', price: 95, size: '750ml', image: '🫒' },
  // Spinneys
  { id: 'sp-1', supermarketId: 'sm-spinneys', name: 'Greek Yogurt 0%', brand: 'Almarai', category: 'Dairy', price: 45, size: '500g', image: '🥛' },
  { id: 'sp-2', supermarketId: 'sm-spinneys', name: 'Organic Eggs', brand: 'Déli', category: 'Dairy', price: 78, size: '12 pack', image: '🥚' },
  { id: 'sp-3', supermarketId: 'sm-spinneys', name: 'Salmon Fillet', brand: 'Fresh', category: 'Meat', price: 185, size: '300g', image: '🐟' },
  { id: 'sp-4', supermarketId: 'sm-spinneys', name: 'Quinoa', brand: 'Bob\'s Red Mill', category: 'Grains', price: 120, size: '500g', image: '🌾' },
  { id: 'sp-5', supermarketId: 'sm-spinneys', name: 'Mixed Berries', brand: 'Fresh', category: 'Produce', price: 65, size: '250g', image: '🫐' },
  { id: 'sp-6', supermarketId: 'sm-spinneys', name: 'Almond Butter', brand: 'Meridian', category: 'Pantry', price: 145, size: '280g', image: '🥜' },
  // Metro Market
  { id: 'mt-1', supermarketId: 'sm-metro', name: 'Labneh', brand: 'Juhayna', category: 'Dairy', price: 22, size: '400g', image: '🥛' },
  { id: 'mt-2', supermarketId: 'sm-metro', name: 'Ground Beef 5%', brand: 'Americana', category: 'Meat', price: 115, size: '500g', image: '🥩' },
  { id: 'mt-3', supermarketId: 'sm-metro', name: 'Egyptian Rice', brand: 'Al Doha', category: 'Grains', price: 35, size: '1 kg', image: '🍚' },
  { id: 'mt-4', supermarketId: 'sm-metro', name: 'Bananas', brand: 'Fresh', category: 'Produce', price: 18, size: '1 kg', image: '🍌' },
  { id: 'mt-5', supermarketId: 'sm-metro', name: 'Tuna in Water', brand: 'Goody', category: 'Pantry', price: 32, size: '185g', image: '🐟' },
  { id: 'mt-6', supermarketId: 'sm-metro', name: 'Chicken Breast', brand: 'Americana', category: 'Meat', price: 92, size: '½ kg', image: '🍗' },
  // Seoudi
  { id: 'sd-1', supermarketId: 'sm-seoudi', name: 'Fresh Milk', brand: 'Juhayna', category: 'Dairy', price: 26, size: '1 L', image: '🥛' },
  { id: 'sd-2', supermarketId: 'sm-seoudi', name: 'Tomatoes', brand: 'Fresh', category: 'Produce', price: 12, size: '1 kg', image: '🍅' },
  { id: 'sd-3', supermarketId: 'sm-seoudi', name: 'Cucumber', brand: 'Fresh', category: 'Produce', price: 8, size: '1 kg', image: '🥒' },
  { id: 'sd-4', supermarketId: 'sm-seoudi', name: 'Whole Chicken', brand: 'Americana', category: 'Meat', price: 88, size: '1 kg', image: '🍗' },
  { id: 'sd-5', supermarketId: 'sm-seoudi', name: 'Lentils', brand: 'Al Doha', category: 'Grains', price: 28, size: '500g', image: '🫘' },
  { id: 'sd-6', supermarketId: 'sm-seoudi', name: 'Honey', brand: 'Imtenan', category: 'Pantry', price: 55, size: '500g', image: '🍯' },
];

export function getSupermarket(id: string): Supermarket | undefined {
  return supermarkets.find((s) => s.id === id);
}

export function getProductsForSupermarket(supermarketId: string): ShopProduct[] {
  return shopProducts.filter((p) => p.supermarketId === supermarketId);
}

export function getRestaurant(id: string): Restaurant | undefined {
  return restaurants.find((r) => r.id === id);
}

export function getRecipe(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

export function getMeal(restaurantId: string, mealId: string) {
  const r = getRestaurant(restaurantId);
  return r?.meals.find((m) => m.id === mealId);
}

export function getDefaultProducts(recipe: Recipe) {
  return recipe.ingredients.map((ing) =>
    ing.options.find((o) => o.id === ing.defaultOptionId)!,
  );
}

export function getQuickMeal(id: string) {
  return quickMeals.find((q) => q.id === id);
}

export function findShopProduct(supermarketId: string, brand: string, name: string) {
  const exact = shopProducts.find(
    (p) => p.supermarketId === supermarketId && p.brand === brand && p.name === name,
  );
  if (exact) return exact;
  return shopProducts.find((p) => p.brand === brand && p.name === name);
}
