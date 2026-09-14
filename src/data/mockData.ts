export interface Product {
  id: string;
  name: string;
  category: 'supermarket' | 'restaurant' | 'supplement' | 'gear' | 'utility';
  price: number;
  protein: number;
  calories: number;
  image: string;
  tags: string[];
  vendor?: string;
}

export interface RecipeIngredient {
  productId: string;
  amount: string;
}

export interface Recipe {
  id: string;
  name: string;
  time: string;
  servings: number;
  protein: number;
  calories: number;
  image: string;
  ingredients: RecipeIngredient[];
  tags: string[];
}

export interface MealSlot {
  time: string;
  label: string;
  suggestion: string;
  productIds: string[];
  type: 'pre-workout' | 'post-workout' | 'meal' | 'snack';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export const userProfile = {
  name: 'Youssef',
  goal: 'Build muscle',
  weight: 78,
  targetWeight: 82,
  dailyCalories: 2400,
  dailyProtein: 160,
  budget: 120,
  gymDays: ['Mon', 'Wed', 'Fri'],
  gymTime: '18:00',
  bodyFat: 14.2,
  muscleMass: 34.8,
};

export const products: Product[] = [
  { id: 'p1', name: 'Greek Yogurt 0%', category: 'supermarket', price: 3.5, protein: 17, calories: 100, image: '🥛', tags: ['high-protein', 'breakfast'] },
  { id: 'p2', name: 'Chicken Breast 500g', category: 'supermarket', price: 6.2, protein: 31, calories: 165, image: '🍗', tags: ['lean', 'meal-prep'] },
  { id: 'p3', name: 'Brown Rice 1kg', category: 'supermarket', price: 2.8, protein: 3, calories: 112, image: '🍚', tags: ['carbs', 'staple'] },
  { id: 'p4', name: 'Avocado', category: 'supermarket', price: 1.9, protein: 2, calories: 160, image: '🥑', tags: ['healthy-fats'] },
  { id: 'p5', name: 'Protein Oats', category: 'supermarket', price: 4.5, protein: 15, calories: 280, image: '🥣', tags: ['breakfast', 'sweet'] },
  { id: 'p6', name: 'Salmon Fillet', category: 'supermarket', price: 9.8, protein: 25, calories: 208, image: '🐟', tags: ['omega-3'] },
  { id: 'p7', name: 'Mixed Berries', category: 'supermarket', price: 4.2, protein: 1, calories: 57, image: '🫐', tags: ['antioxidants', 'sweet'] },
  { id: 'p8', name: 'Eggs (12 pack)', category: 'supermarket', price: 3.1, protein: 6, calories: 78, image: '🥚', tags: ['breakfast', 'staple'] },
  { id: 'r1', name: 'Grilled Chicken Bowl', category: 'restaurant', price: 12.5, protein: 42, calories: 480, image: '🥗', tags: ['high-protein'], vendor: 'Green Bite' },
  { id: 'r2', name: 'Salmon Poke Bowl', category: 'restaurant', price: 14.0, protein: 35, calories: 420, image: '🍱', tags: ['omega-3'], vendor: 'Fresh Wave' },
  { id: 'r3', name: 'Protein Pancakes', category: 'restaurant', price: 9.5, protein: 28, calories: 350, image: '🥞', tags: ['sweet', 'breakfast'], vendor: 'Fit Kitchen' },
  { id: 'r4', name: 'Turkey Wrap', category: 'restaurant', price: 8.0, protein: 32, calories: 380, image: '🌯', tags: ['lunch'], vendor: 'Green Bite' },
  { id: 's1', name: 'Whey Protein 1kg', category: 'supplement', price: 35, protein: 24, calories: 120, image: '💪', tags: ['post-workout'] },
  { id: 's2', name: 'Creatine Monohydrate', category: 'supplement', price: 18, protein: 0, calories: 0, image: '⚡', tags: ['strength'] },
  { id: 's3', name: 'BCAA Powder', category: 'supplement', price: 22, protein: 0, calories: 5, image: '🧪', tags: ['recovery'] },
  { id: 'g1', name: 'Resistance Bands Set', category: 'gear', price: 25, protein: 0, calories: 0, image: '🎯', tags: ['home-gym'] },
  { id: 'g2', name: 'Yoga Mat', category: 'gear', price: 20, protein: 0, calories: 0, image: '🧘', tags: ['flexibility'] },
  { id: 'u1', name: 'Shaker Bottle 700ml', category: 'utility', price: 8, protein: 0, calories: 0, image: '🥤', tags: ['meal-prep'] },
  { id: 'u2', name: 'Meal Prep Containers (5)', category: 'utility', price: 12, protein: 0, calories: 0, image: '📦', tags: ['cooking'] },
  { id: 'u3', name: 'Insulated Lunch Bag', category: 'utility', price: 15, protein: 0, calories: 0, image: '👜', tags: ['on-the-go'] },
];

export const recipes: Recipe[] = [
  {
    id: 'rec1',
    name: 'High-Protein Chicken Rice Bowl',
    time: '25 min',
    servings: 2,
    protein: 45,
    calories: 520,
    image: '🍲',
    tags: ['meal-prep', 'post-workout'],
    ingredients: [
      { productId: 'p2', amount: '300g' },
      { productId: 'p3', amount: '150g dry' },
      { productId: 'p4', amount: '1/2' },
    ],
  },
  {
    id: 'rec2',
    name: 'Berry Protein Oats',
    time: '10 min',
    servings: 1,
    protein: 32,
    calories: 380,
    image: '🥣',
    tags: ['breakfast', 'sweet'],
    ingredients: [
      { productId: 'p5', amount: '1 pack' },
      { productId: 'p7', amount: '100g' },
      { productId: 'p1', amount: '100g' },
    ],
  },
  {
    id: 'rec3',
    name: 'Salmon & Avocado Plate',
    time: '20 min',
    servings: 1,
    protein: 38,
    calories: 450,
    image: '🐟',
    tags: ['dinner', 'omega-3'],
    ingredients: [
      { productId: 'p6', amount: '200g' },
      { productId: 'p4', amount: '1 whole' },
      { productId: 'p8', amount: '2 eggs' },
    ],
  },
];

export const todayMeals: MealSlot[] = [
  { time: '07:30', label: 'Breakfast', suggestion: 'Berry Protein Oats', productIds: ['p5', 'p7', 'p1'], type: 'meal' },
  { time: '12:30', label: 'Lunch', suggestion: 'Grilled Chicken Bowl', productIds: ['r1'], type: 'meal' },
  { time: '17:30', label: 'Pre-Workout', suggestion: 'Banana + Greek Yogurt', productIds: ['p1'], type: 'pre-workout' },
  { time: '19:30', label: 'Post-Workout', suggestion: 'Whey Shake + Chicken Rice', productIds: ['s1', 'p2', 'p3'], type: 'post-workout' },
  { time: '21:00', label: 'Evening Snack', suggestion: 'Protein Pancakes', productIds: ['r3'], type: 'snack' },
];

export const inventory = [
  { name: 'Brown Rice', qty: '400g', expires: '3 weeks' },
  { name: 'Eggs', qty: '6 left', expires: '5 days' },
  { name: 'Whey Protein', qty: '60%', expires: '2 months' },
  { name: 'Avocado', qty: '2', expires: '2 days' },
];

export const dietPlan = {
  name: 'Lean Bulk — Week 1',
  dailyAvg: { calories: 2380, protein: 158, budget: 18.5 },
  days: [
    { day: 'Mon', gym: true, meals: ['Berry Oats', 'Chicken Bowl', 'Post-WO Shake'] },
    { day: 'Tue', gym: false, meals: ['Eggs & Toast', 'Turkey Wrap', 'Salmon Plate'] },
    { day: 'Wed', gym: true, meals: ['Protein Oats', 'Meal Prep Bowl', 'Post-WO Shake'] },
    { day: 'Thu', gym: false, meals: ['Greek Yogurt Bowl', 'Poke Bowl', 'Chicken Rice'] },
    { day: 'Fri', gym: true, meals: ['Eggs & Avocado', 'Turkey Wrap', 'Post-WO Shake'] },
    { day: 'Sat', gym: false, meals: ['Pancakes', 'Salmon Plate', 'Sweet Snack'] },
    { day: 'Sun', gym: false, meals: ['Meal Prep Day', 'Chicken Rice Bowl', 'Rest Day Light'] },
  ],
};

export const aiSuggestions = [
  "Based on your 6pm gym session, I'd suggest a light pre-workout snack at 5:30pm — Greek yogurt with berries gives you fast carbs without feeling heavy.",
  "You're 40g short on protein today. Add a whey shake post-workout or swap lunch for the Grilled Chicken Bowl (+12g protein).",
  "Your InBody shows good muscle mass. For lean bulk, keep calories at 2,400 and prioritize post-workout meals within 45 minutes.",
  "Weekly budget: $86 spent of $120. You can add salmon twice this week and stay on track.",
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
