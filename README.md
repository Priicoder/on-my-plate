# 🌿 On My Plate

**Personalised plant-based nutrition.** A free, no-sign-up web app that generates a tailored **7-day vegetarian or vegan meal plan** from a short questionnaire, then turns it into a ready-to-shop grocery list — all powered by an LLM.

> Answer a few questions about who you are, how you eat, what you can cook, and what you're observing this week — and get a complete week of meals that actually fits your life.

---

## What it does

The app walks you through a two-step form and produces a personalised weekly diet chart. Every answer feeds into the meal-generation prompt, so the plan respects your body, beliefs, kitchen, and goals at the same time.

### Who you are
- **Age group** and **biological sex** — to calibrate nutritional needs.
- **Female-specific conditions** — pregnancy, postpartum/nursing, PCOS, perimenopause/menopause (shown only when relevant).
- **Health conditions** (everyone) — diabetes, thyroid, high BP, high cholesterol, anemia, IBS, celiac, kidney issues, fatty liver, arthritis. Each maps to concrete nutrition guidance (e.g. selenium-rich foods for thyroid, low-GI for diabetes, iron + vitamin C for anemia).

### How you eat
- **Diet type** — Vegetarian or Vegan.
- **Egg preference** — for vegetarians, with-egg or eggless.
- **Eating pattern** — Balanced, **Keto**, High protein, Low carb, **Intermittent fasting (16:8)**, or **Liquid diet**.
- **Goals** — pick up to 3 (weight loss/gain, gut health, energy, hair/skin, immunity, hormonal balance, and more).
- **Cuisine** — North/South Indian, Continental, Mediterranean, East Asian, Gujarati, Bengali, or mixed.
- **Daily food budget** — Budget / Moderate / Premium.
- **Allergies & intolerances** — gluten, dairy, nuts, soy, eggs, sesame, etc.

### Where you live & cook
- **Kitchen setup** — Full kitchen, Minimal (kettle/microwave), or **No cooking** (PG/hostel). The no-cook mode suggests only ready-to-eat meals (fruits, salads, sprouts, curd, overnight oats, sandwiches) that need zero heat.

### What you observe
- **Religious / cultural preferences** — Jain (no onion, garlic, root veg) or Sattvic (no onion, garlic), applied to every meal.
- **Fasting & festival calendar** — pick your faith, then choose from **upcoming, real-dated observances** and the plan tailors those specific days:
  - **Hindu** — Ekadashi, Pradosh, Sawan Somwar, Navratri
  - **Muslim** — Ramadan (Sehri + Iftar meal structure)
  - **Jain** — Ashtami, Chaudas fasts
  - **Christian** — Ash Wednesday, Lenten Fridays, Good Friday
  - **Buddhist** — Uposatha, Buddha Purnima
  - **Sikh** — Baisakhi, Guru Nanak Gurpurab

### After the plan is generated
- **7-day plan view** with day tabs, four meals + a daily tip, and seasonal-fruit suggestions.
- **Save** — export/print the full diet chart.
- **Required groceries** — generates a consolidated, categorised weekly shopping list (vegetables, fruits, grains, pulses, dairy, nuts, pantry) with approximate quantities, and prints it as a checkable shopping checklist.

Because the grocery list is built from your actual plan, it automatically reflects every constraint — a no-cook eggless plan yields ready-to-eat items with no eggs; a Jain plan has no onion/garlic/root veg.

---

## How the observance calendar works

Knowing *when* each fast or festival falls is the tricky part:

- **Muslim (Ramadan)** dates come live from the free, keyless [Aladhan API](https://aladhan.com/islamic-calendar-api).
- **Christian** dates are computed exactly using the **Computus** (Easter) algorithm.
- **Hindu / Jain / Buddhist** dates are computed server-side from solar & lunar longitude → **tithi** (Panchang), placed on the civil day by sunrise.
- **Sikh** Baisakhi is a fixed solar date; Guru Nanak Gurpurab is the Kartik Purnima.

> Astronomically-computed Panchang dates can be ±1 day in rare boundary cases (a caveat even commercial Panchang APIs carry), so the UI shows a "verify locally for strict observance" note. Ramadan and Christian dates are exact.

---

## Who it's for

- Anyone wanting a **plant-based** weekly plan without paying for a dietitian or signing up.
- **Students & working professionals in PGs/hostels** with no stove (the no-cook mode).
- People managing a **health condition** who want diet-aligned meals.
- People who **observe fasts/festivals** and want their plan to respect those days automatically.
- Anyone following a specific **eating pattern** (keto, high-protein, intermittent fasting, liquid).

---

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express (ES modules) |
| AI | OpenRouter (OpenAI-compatible), default model `anthropic/claude-sonnet-4.6` |
| External data | Aladhan API (Islamic calendar) |

The backend proxies all LLM calls so the API key stays server-side and the browser is never blocked by CORS.

---

## Project structure

```text
frontend/
  src/
    components/   # steps (form), plan (results), common (UI)
    constants/    # data.js — all options (diets, faiths, conditions…)
    utils/        # mealPlan.js (prompt building), printPlan.js, season.js
backend/
  src/
    routes/       # API routes
    controllers/  # planController (LLM proxy), observancesController (calendar)
    utils/        # astro.js — Panchang/tithi computation
    config/       # env.js
```

### API endpoints

| Method | Route | Purpose |
|---|---|---|
| `GET`  | `/health` | Health check |
| `POST` | `/api/plan` | Proxy a prompt to the LLM, return generated text (used for both the meal plan and the grocery list) |
| `GET`  | `/api/observances?from=YYYY-MM-DD&days=N` | Upcoming fasting/festival dates across faiths |

---

## Getting started

### Prerequisites
- Node.js 18+
- An [OpenRouter API key](https://openrouter.ai/keys) (free tier available)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # then edit .env and add your key
npm run dev               # starts on http://localhost:5000
```

`.env`:
```ini
NODE_ENV=development
PORT=5000
OPENROUTER_API_KEY=your_key_here
LLM_MODEL=anthropic/claude-sonnet-4.6   # optional, any OpenRouter model slug
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev               # starts on http://localhost:5173
```

The frontend calls `http://localhost:5000` by default. To point at a different backend, set `VITE_API_BASE_URL` in a `frontend/.env` file.

### Build for production
```bash
cd frontend && npm run build   # output in frontend/dist
cd backend && npm start
```

---

## Notes & disclaimers

- This is a **general nutritional guide**, not medical advice. For medical conditions, pregnancy, or strict religious observance, please consult a registered dietitian / your local Panchang.
- No accounts, no tracking — the form data lives only in the browser session and is sent to the backend solely to generate your plan.
