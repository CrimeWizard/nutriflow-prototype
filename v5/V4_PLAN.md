# NutriFlow v4 — Plan (not built yet)

## Core product: two marketplaces in one app

The app does **two things**:

### 1. Healthy restaurants
A curated directory of healthy restaurants / healthy food shops.

**User flow:**
- Browse restaurants (list + filters: area, cuisine, high-protein, etc.)
- Enter a restaurant → see their menu / items
- View meals with name, price, basic nutrition where available
- Add meals to cart
- Checkout (same cart + COD flow as v3)

**Demo data (Egypt):**
- Real-sounding local healthy spots (bowl shops, grilled chicken, meal-prep kitchens)
- 3–5 restaurants, 5–8 meals each
- Restaurant profile: name, area, delivery time, tags

### 2. Supermarket / groceries
Partner healthy supermarkets (or dark-store grocery).

**User flow:**
- Browse grocery categories OR recipes → shop ingredients (from v2/v3)
- Pick brands per ingredient (Almarai, Juhayna, etc.)
- Add to same unified cart
- Checkout once for restaurant meals + groceries together (or split orders — TBD)

**Demo data:**
- Carrefour / Seoudi / Gourmet-style partner (one store for demo)
- Real Egyptian SKUs with EGP prices

---

## What makes v4 "real"

| v3 (current) | v4 (target) |
|--------------|-------------|
| One generic "Market" tab | **Restaurants** tab + **Supermarket** tab (or unified Shop with two sections) |
| Recipes only imply groceries | Recipes link to supermarket ingredient picker |
| Meals on home are abstract | Meals can come from **restaurant** OR **recipe/supermarket** |
| Single store label | Named restaurant + named supermarket partner |

---

## Suggested navigation (v4)

```
Home          — today's plan (mix of restaurant meals + cook-at-home)
Restaurants   — browse → restaurant → menu → add to cart
Supermarket   — categories / recipes → ingredient picker
Cart          — restaurant items + grocery items, grouped
```

Or bottom nav:
`Home · Eat out · Groceries · Cart`

---

## Cart UX note

Show two groups in cart:
1. **From [Restaurant name]** — ready meals
2. **From [Supermarket name]** — groceries

User still one checkout, pay on delivery (demo).

---

## Out of scope for v4

- Real API / live inventory
- Multiple supermarket chains
- Delivery tracking map
- Macro tracking / daily logging

---

## Build order for v4

1. Restaurant list + restaurant detail + meal cards
2. Add restaurant meals to cart (reuse v3 cart/checkout)
3. Split Market tab → Supermarket (keep ingredient picker)
4. Unified cart with grouped sections
5. Home shows mix: "Lunch from Green Bite" + "Dinner cook: Chicken Rice Bowl"
