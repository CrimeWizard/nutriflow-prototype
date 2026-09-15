# NutriFlow Prototype v5

**Frozen at Pillar 1** — smart weekly plan only. Pillar 2 (honest commerce) is in **v6**.

**Smart weekly plan** — Pillar 1: dynamic meal planning (Sat–Fri), gym-aware slots, goal-based picks.

Built on v4 (dual marketplace + profile). Egypt-first, commerce-first, English UI.

## What's new in v5 (Pillar 1)

| v4 | v5 |
|----|-----|
| Static `todayMeals` for everyone | **Generated weekly plan** from goal + gym days + area |
| Same meals every day | **Gym days** vs **rest days** — different slots & picks |
| No explanation on meals | **"Why" line** on every meal card |
| Monday-first thinking | **Week starts Saturday** (Egypt / Islamic calendar) |
| Pre-workout dead end | **Quick meals** add to cart in one tap |

## Run

```bash
npm install
npm run dev
```

Port: **5177**

## Demo

1. Onboard → set gym days, goal, area
2. Home → week strip (Sat–Fri), tap days — plan changes
3. Change goal in Profile → plan updates
4. Tap quick pre-workout → adds to cart
5. "Add today's meals to cart" uses selected day
