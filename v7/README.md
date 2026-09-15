# NutriFlow Prototype v7

**Frozen at v7.2** — Pillar 3 lives here. Pillar 4 (trust + visuals) is in **v8**.

**Pillar 3 + v7.1/v7.2 polish** — reorder, search, favorites, staples, filters, goal badges, order my week. Built on v6 commerce + v5 weekly plan.

Egypt-first, for all budgets.

## Version map

| Version | Pillar | Focus |
|---------|--------|--------|
| v5 | 1 | Smart weekly plan (Sat–Fri), gym-aware meals |
| v6 | 2 | Honest checkout, cart control, orders persistence |
| **v7** | **3** | Reorder, search, favorites, staples |

## v7.2 polish

- **Restaurant filters** — High protein, meal prep, breakfast chips on Eat out
- **Goal badges** — “Fits your goal” / “Great for bulk” on restaurant menus
- **Order my week** — one-tap add full Sat–Fri plan to cart from Home hero
- **Richer menus** — a few more meals at Green Bite & Lean & Clean

## v7.1 polish

- **Recipe plan costs** use per-serving estimates (not full ingredient packs)
- **Recipe protein** included in daily plan totals
- **Favorites** — product adds to cart; meal opens menu at that dish
- **Staples** labeled “Suggested” until you’ve ordered groceries
- **Orders** auto-mark delivered after ~90s in demo (+ hint on Home)

## What's new in v7

| Feature | Detail |
|---------|--------|
| Order status | Mark delivered; Home "Current orders" uses status, not just time |
| Reorder | Full order or per-delivery from Orders; grocery reorder banner on Home |
| Search | Restaurants, meals, products, recipes (contextual, not a dead tab) |
| Favorites | Heart + Profile section; persists in `nf-v7-favorites` |
| Staples | Quick-add row on Groceries from history + defaults |
| Ingredients | Only shows products available at your selected supermarket |

## Run

```bash
npm install
npm run dev
```

Port: **5179**

## Demo flows

1. Place a grocery order → mark delivered → see reorder banner on Home
2. Heart a meal/recipe/product → check Profile → Favorites
3. Search "chicken" on Eat out or Groceries
4. Groceries → Your staples row after ordering
