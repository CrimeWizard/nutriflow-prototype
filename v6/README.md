# NutriFlow Prototype v6

**Pillar 2 + v6.1 polish** — honest commerce, weekly plan, orders persistence, 8 recipes.

Built on **v5 (Pillar 1)** weekly plan. Egypt-first, for all budgets.

## Version map

| Version | Pillar | Focus |
|---------|--------|--------|
| v5 | 1 | Smart weekly plan (Sat–Fri), gym-aware meals |
| **v6** | **2** | Honest checkout, cart control, budget & shopping mode |

## What's new in v6

| v5 | v6 |
|----|-----|
| Cart: add only | **Remove, quantity, drop whole delivery** |
| One ETA at checkout | **Split deliveries** per restaurant / supermarket |
| Same plan for everyone | **Budget tier** + **shopping mode** (groceries / restaurants / mix) |
| "Add today's meals" primary | **Tap one meal** primary; full day is secondary |
| Order = flat list | Order shows **multiple deliveries** |

## v6.1 polish

- **Orders persist** across refresh (`localStorage`)
- **Current orders** on Home (24h active window)
- **My orders** screen + sticky checkout bar
- **Area-only restaurants** (no wrong-area listings)
- **8 recipes** including budget-friendly cook-at-home meals
- **Daily budget** comparison on Home (not misleading weekly total)

## Run

```bash
npm install
npm run dev
```

Port: **5178**

## Demo

1. Onboard → pick **Mostly groceries** + **Tight budget**
2. Home → plan leans cook-at-home; tap one meal to add
3. Add restaurant meal + groceries → Cart shows **2 deliveries**
4. Checkout → separate ETAs · remove one group if too much
5. Order success → "2 deliveries scheduled"
