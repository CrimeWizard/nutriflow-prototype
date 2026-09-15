export const copy = {
  brand: 'NutriFlow',

  nav: {
    home: 'Home',
    recipes: 'Recipes',
    shop: 'Market',
    cart: 'Cart',
  },

  home: {
    greeting: (name: string) => `Hey, ${name}`,
    gymDay: 'Gym day',
    restDay: 'Rest day',
    valueProp: 'Your meals are planned — just order when you\'re ready.',
    gymPill: (time: string) => `Training at ${time}`,
    gymPillSub: 'Meals timed around your session',
    todayMeals: "Today's meals",
    shopIngredients: 'Shop ingredients',
    addAllCta: "Add today's meals to cart",
    addAllHint: 'Best options already picked for you',
  },

  recipes: {
    title: 'Recipes',
    subtitle: 'Choose a recipe, pick your brands, checkout',
    shopIngredients: 'Shop ingredients',
    meta: (time: string, count: number) => `${time} · ${count} ingredients`,
  },

  ingredients: {
    title: 'Shop ingredients',
    subtitle: 'Pick brand and size for each item',
    progress: (n: number) => `${n} items · defaults selected`,
    needAmount: (amount: string) => `Needed: ${amount}`,
    total: 'Total',
    addToCart: 'Add to cart',
  },

  shop: {
    title: 'Market',
    subtitle: 'Carrefour · New Cairo',
  },

  cart: {
    title: 'Your cart',
    items: (n: number) => `${n} item${n === 1 ? '' : 's'} · Pay on delivery`,
    empty: 'Nothing in your cart yet',
    emptyHint: 'Shop ingredients from a recipe, or add today\'s meals from Home',
    total: 'Total',
    checkout: 'Place order',
    checkoutSub: 'Pay on delivery',
    fromRecipe: (name: string) => `For ${name}`,
  },

  toast: {
    recipeAdded: (name: string) => `${name} added to cart`,
    todayAdded: "Today's meals added to cart",
    itemAdded: (brand: string, name: string) => `Added ${brand} ${name}`,
    orderPlaced: 'Order placed — pay on delivery',
  },
};
