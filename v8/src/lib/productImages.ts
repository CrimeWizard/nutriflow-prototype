import type { ProductCategory } from '../types';

const BY_KEYWORD: [RegExp, string][] = [
  [/yogurt|labneh/i, '/images/products/yogurt.jpg'],
  [/chicken/i, '/images/products/chicken.jpg'],
  [/egg/i, '/images/products/eggs.jpg'],
  [/rice/i, '/images/products/rice.jpg'],
  [/oat/i, '/images/products/oats.jpg'],
  [/avocado/i, '/images/products/avocado.jpg'],
  [/salmon/i, '/images/products/salmon.jpg'],
  [/beef/i, '/images/products/beef.jpg'],
  [/banana/i, '/images/products/banana.jpg'],
  [/tomato/i, '/images/products/tomato.jpg'],
  [/cucumber/i, '/images/products/cucumber.jpg'],
  [/tuna/i, '/images/products/tuna.jpg'],
  [/milk/i, '/images/products/milk.jpg'],
  [/olive oil/i, '/images/products/olive-oil.jpg'],
  [/quinoa/i, '/images/products/quinoa.jpg'],
  [/berr/i, '/images/products/berries.jpg'],
  [/almond butter/i, '/images/products/almond-butter.jpg'],
  [/lentil/i, '/images/products/lentils.jpg'],
  [/honey/i, '/images/products/honey.jpg'],
];

const BY_CATEGORY: Partial<Record<ProductCategory, string>> = {
  Dairy: '/images/products/yogurt.jpg',
  Meat: '/images/products/chicken.jpg',
  Grains: '/images/products/rice.jpg',
  Produce: '/images/products/tomato.jpg',
  Pantry: '/images/products/olive-oil.jpg',
};

export function productPhoto(product: {
  name: string;
  category: ProductCategory;
}): string | null {
  for (const [pattern, src] of BY_KEYWORD) {
    if (pattern.test(product.name)) return src;
  }
  return BY_CATEGORY[product.category] ?? null;
}
