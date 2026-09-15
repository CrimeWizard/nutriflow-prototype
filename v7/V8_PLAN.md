# NutriFlow V8 — Pillar 4: Local Soul + Emotion (English only)

**Status:** Planning — Arabic/RTL **deferred** to a future version.

**Clone from:** v7.2 frozen → `nutriflow-prototype-v8`, port **5180**, `nf-v8-*` keys.

---

## Scope change

| Original Pillar 4 | V8 now | Deferred |
|-------------------|--------|----------|
| Arabic + RTL | ❌ Skip | v9 or later |
| Trust copy upgrade | ✅ | — |
| Food photos | ✅ | — |
| Quick meal preview | ✅ | — |
| Reorder / favorites | ✅ Already in v7 | — |

**One sentence:** V8 makes the app feel **real and trustworthy in English** — better copy, real food imagery, honest quick-meal adds. Egypt context stays via areas, EGP, brands, Sat–Fri week (no translation layer).

---

## Success criteria

- [ ] Home meal cards show **rich trust lines** (protein, goal, vendor, area)
- [ ] Restaurant menu has **hero image** + meal photos (not emoji)
- [ ] Quick pre-workout tap → **preview sheet** → confirm → cart
- [ ] Quick meals respect **user area** (no wrong-city restaurant adds)
- [ ] Checkout / order success feel **human**, not wireframe

---

## Workstream 1 — Trust copy

**Upgrade `src/planning/why.ts`:**

| Slot | Target copy pattern |
|------|---------------------|
| Post-workout restaurant | `{protein}g protein — refuel after training · From {name} · {area}` |
| Recipe | `~{protein}g protein/serving · cook at home · {gym/rest context}` |
| Quick | (moved to preview sheet; Home why = one-line teaser) |
| Rest-day dinner | `Lighter rest-day dinner · From {name}` |

**Also:**
- Restaurant menu: line under nutrition — `Delivers to {profile.area}`
- Checkout payment badge: clearer COD copy
- Order success: warmer headline + per-delivery reminder

**Reuse:** align with existing `GoalFitBadge` — don’t duplicate conflicting messages.

---

## Workstream 2 — Food photos

**Assets:** `public/images/food/*.webp` (~12–15 images, offline, royalty-free)

**Code:**
```
src/lib/foodImages.ts     # photoId → path
src/components/FoodImage.tsx  # img + emoji fallback
```

**Optional `photoId` on:** `Restaurant`, `RestaurantMeal`, `Recipe` (minimal mockData edits)

**Priority surfaces:**
1. `RestaurantMenu` — hero banner at top
2. Home planned meal cards — small thumb
3. `Restaurants` list — card image
4. (v8.1) Groceries product lines

---

## Workstream 3 — Quick meal preview

**New:** `src/lib/quickMealResolve.ts`

```text
resolveQuickMeal(quickMealId, profile, supermarketId)
  → { items, lines[], unavailable[] }
```

**Rules:**
- Restaurant matcher only if `restaurant.area === profile.area`
- Else supermarket via `findShopProduct`
- If nothing resolvable → toast, don’t add

**UI:** `QuickMealPreview.tsx` bottom sheet on Home when user taps quick meal:
- List items + estimated total
- **Add to cart** / Cancel

**Change Home:** quick meal tap opens preview (not immediate `addToCart`).

---

## Build order

| Phase | Deliverable |
|-------|-------------|
| **8a** | `why.ts` rewrite + menu/checkout/success copy |
| **8b** | `FoodImage` + assets + menu hero + home thumbs |
| **8c** | `quickMealResolve` + preview sheet + Home wire-up |
| **8d** | QA pass: area mismatch, empty preview, image fallbacks |

**Estimate:** ~2 focused sessions (half of original Pillar 4 without i18n).

---

## Out of scope (v8)

- Arabic / RTL / `locale` toggle
- AI coach, payments, dark mode
- Full grocery photo catalog
- New navigation tabs

---

## Future: Pillar 4b (or v9)

When ready:
- `src/i18n/en.ts` + `ar.ts`
- Profile language toggle
- RTL CSS pass
- Locale-aware `why.ts` (templates already structured for easy extraction)

---

## Freeze before v8

- [ ] Commit + push v7.2
- [ ] Mark v7 frozen in README + `NUTRIFLOW-PROTOTYPES.md`
- [ ] `cp -r v7 v8`, sed keys/port, implement 8a→8d
