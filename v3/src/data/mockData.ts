import type { MealSuggestion, Recipe, ShopProduct, SupermarketProduct } from '../types';

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const DELIVERY_AREAS = [
  'New Cairo',
  'Maadi',
  '6th of October',
  'Sheikh Zayed',
  'Nasr City',
  'Heliopolis',
] as const;

export const GYM_TIMES = [
  '06:00', '07:00', '08:00', '12:00', '17:00', '18:00', '19:00', '20:00', '21:00',
] as const;

export const GOALS = [
  { id: 'cut' as const, title: 'Lose weight', desc: 'Lighter meals, still enough protein' },
  { id: 'maintain' as const, title: 'Stay fit', desc: 'Balanced eating around training' },
  { id: 'bulk' as const, title: 'Build muscle', desc: 'Higher protein, bigger portions' },
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
        id: 'yogurt',
        name: 'Yogurt',
        amount: '~200g',
        defaultOptionId: 'yog-almarai-500',
        options: [
          { id: 'yog-almarai-500', brand: 'Almarai', name: 'Greek Yogurt 0%', size: '500g', price: 42, image: '🥛' },
          { id: 'yog-juhayna-400', brand: 'Juhayna', name: 'Light Yogurt', size: '400g', price: 28, image: '🥛' },
          { id: 'yog-domo-500', brand: 'Domty', name: 'Full Fat Yogurt', size: '500g', price: 22, image: '🥛' },
        ],
      },
      {
        id: 'chicken',
        name: 'Chicken breast',
        amount: '~300g',
        defaultOptionId: 'chk-half',
        options: [
          { id: 'chk-quarter', brand: 'Americana', name: 'Chicken Breast', size: '¼ kg', price: 55, image: '🍗' },
          { id: 'chk-half', brand: 'Americana', name: 'Chicken Breast', size: '½ kg', price: 98, image: '🍗' },
          { id: 'chk-1kg', brand: 'Al Watania', name: 'Chicken Breast', size: '1 kg', price: 185, image: '🍗' },
        ],
      },
      {
        id: 'rice',
        name: 'Rice',
        amount: '150g dry',
        defaultOptionId: 'rice-brown-1kg',
        options: [
          { id: 'rice-brown-1kg', brand: "Uncle Ben's", name: 'Brown Rice', size: '1 kg', price: 68, image: '🍚' },
          { id: 'rice-white-1kg', brand: 'Al Doha', name: 'Egyptian Rice', size: '1 kg', price: 35, image: '🍚' },
        ],
      },
      {
        id: 'avocado',
        name: 'Avocado',
        amount: '1 piece',
        defaultOptionId: 'avo-1',
        options: [
          { id: 'avo-1', brand: 'Fresh', name: 'Avocado', size: '1 pc', price: 25, image: '🥑' },
          { id: 'avo-3', brand: 'Fresh', name: 'Avocado', size: '3 pack', price: 65, image: '🥑' },
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
        id: 'oats',
        name: 'Oats',
        amount: '1 serving',
        defaultOptionId: 'oats-quaker',
        options: [
          { id: 'oats-quaker', brand: 'Quaker', name: 'Oats', size: '500g', price: 48, image: '🥣' },
          { id: 'oats-nestle', brand: 'Nestlé', name: 'Fitness Cereal', size: '375g', price: 55, image: '🥣' },
        ],
      },
      {
        id: 'yogurt2',
        name: 'Yogurt',
        amount: '150g',
        defaultOptionId: 'yog-juhayna-400',
        options: [
          { id: 'yog-almarai-500', brand: 'Almarai', name: 'Greek Yogurt 0%', size: '500g', price: 42, image: '🥛' },
          { id: 'yog-juhayna-400', brand: 'Juhayna', name: 'Light Yogurt', size: '400g', price: 28, image: '🥛' },
        ],
      },
      {
        id: 'berries',
        name: 'Mixed berries',
        amount: '100g',
        defaultOptionId: 'berry-frozen',
        options: [
          { id: 'berry-frozen', brand: 'Fresh Market', name: 'Frozen Mixed Berries', size: '400g', price: 89, image: '🫐' },
          { id: 'berry-straw', brand: 'Fresh', name: 'Strawberries', size: '250g', price: 35, image: '🍓' },
        ],
      },
    ],
  },
  {
    id: 'r3',
    name: 'Grilled Chicken Plate',
    time: '20 min',
    servings: 1,
    image: '🥗',
    tags: ['dinner', 'low-carb'],
    ingredients: [
      {
        id: 'chicken2',
        name: 'Chicken breast',
        amount: '250g',
        defaultOptionId: 'chk-quarter',
        options: [
          { id: 'chk-quarter', brand: 'Americana', name: 'Chicken Breast', size: '¼ kg', price: 55, image: '🍗' },
          { id: 'chk-half', brand: 'Americana', name: 'Chicken Breast', size: '½ kg', price: 98, image: '🍗' },
        ],
      },
      {
        id: 'eggs',
        name: 'Eggs',
        amount: '2 eggs',
        defaultOptionId: 'eggs-15',
        options: [
          { id: 'eggs-15', brand: 'El Wadi', name: 'White Eggs', size: '15 pack', price: 62, image: '🥚' },
          { id: 'eggs-30', brand: 'El Wadi', name: 'White Eggs', size: '30 pack', price: 115, image: '🥚' },
        ],
      },
      {
        id: 'salad',
        name: 'Mixed salad',
        amount: '1 bag',
        defaultOptionId: 'salad-mix',
        options: [
          { id: 'salad-mix', brand: 'Fresh', name: 'Ready Salad Mix', size: '200g', price: 18, image: '🥬' },
          { id: 'salad-romaine', brand: 'Fresh', name: 'Romaine Lettuce', size: '1 head', price: 12, image: '🥬' },
        ],
      },
    ],
  },
];

export const todayMeals: MealSuggestion[] = [
  { time: '07:30', label: 'Breakfast', title: 'Berry Protein Oats', type: 'meal', recipeId: 'r2' },
  { time: '13:00', label: 'Lunch', title: 'Chicken Rice Bowl', type: 'meal', recipeId: 'r1' },
  { time: '17:30', label: 'Pre-workout', title: 'Banana + Juhayna yogurt', type: 'pre-workout' },
  { time: '19:30', label: 'Post-workout', title: 'Grilled Chicken Plate', type: 'post-workout', recipeId: 'r3' },
];

export const shopProducts: ShopProduct[] = [
  { id: 's1', name: 'Greek Yogurt 0%', brand: 'Almarai', category: 'Dairy', price: 42, size: '500g', image: '🥛' },
  { id: 's2', name: 'Light Yogurt', brand: 'Juhayna', category: 'Dairy', price: 28, size: '400g', image: '🥛' },
  { id: 's3', name: 'Chicken Breast', brand: 'Americana', category: 'Meat', price: 98, size: '½ kg', image: '🍗' },
  { id: 's4', name: 'Brown Rice', brand: "Uncle Ben's", category: 'Grains', price: 68, size: '1 kg', image: '🍚' },
  { id: 's5', name: 'White Eggs', brand: 'El Wadi', category: 'Dairy', price: 62, size: '15 pack', image: '🥚' },
  { id: 's6', name: 'Avocado', brand: 'Fresh', category: 'Produce', price: 25, size: '1 pc', image: '🥑' },
  { id: 's7', name: 'Whey Protein', brand: 'Optimum', category: 'Supplements', price: 1850, size: '2 lbs', image: '💪' },
  { id: 's8', name: 'Oats', brand: 'Quaker', category: 'Grains', price: 48, size: '500g', image: '🥣' },
];

export function getRecipe(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

export function getDefaultProducts(recipe: Recipe): SupermarketProduct[] {
  return recipe.ingredients.map((ing) =>
    ing.options.find((o) => o.id === ing.defaultOptionId)!,
  );
}
