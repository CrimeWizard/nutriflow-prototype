# NutriFlow v8 — Pillar 3: Depth & Habit

**Goal:** Features that bring users back — reorder, search, favorites, staples.

## Features

| Feature | Description |
|---------|-------------|
| Order status | `active` / `delivered`; mark delivered; Home shows only active |
| Reorder | Per-delivery and full-order from Orders; staples banner on Home |
| Search | Contextual on Eat out, menu, Groceries (products + recipes) |
| Favorites | Heart on meals, recipes, products; Profile section; `nf-v8-favorites` |
| Staples | Horizontal row on Groceries (defaults + learned from order history) |
| Ingredients | Options filtered to selected supermarket via `findShopProduct` |

## New modules

- `src/lib/search.ts` — query matching
- `src/lib/reorder.ts` — delivery → cart inputs
- `src/lib/favorites.ts` — persist favorites
- `src/lib/staples.ts` — staple product list
- `src/lib/recipeIngredients.ts` — supermarket-filtered ingredient options
- `src/components/SearchBar.tsx`, `FavoriteButton.tsx`

## localStorage keys

- `nf-v8-onboarded`, `nf-v8-profile`, `nf-v8-supermarket`, `nf-v8-orders`, `nf-v8-favorites`

## Port

5180
