// ── Data ──────────────────────────────────────────────────────────────────────
export const CUISINES = [
  { id: "north_indian",   label: "North Indian",   emoji: "🫓" },
  { id: "south_indian",   label: "South Indian",   emoji: "🥞" },
  { id: "continental",    label: "Continental",    emoji: "🥗" },
  { id: "mediterranean",  label: "Mediterranean",  emoji: "🫒" },
  { id: "east_asian",     label: "East Asian",     emoji: "🍜" },
  { id: "gujarati",       label: "Gujarati",       emoji: "🥙" },
  { id: "bengali",        label: "Bengali",        emoji: "🐟" },
  { id: "mixed",          label: "Mixed / Any",    emoji: "🌍" },
];

export const AGE_GROUPS = [
  { id: "teen",      label: "Teen",         sub: "13–17 yrs",  emoji: "🧒" },
  { id: "young",     label: "Young adult",  sub: "18–29 yrs",  emoji: "🧑" },
  { id: "adult",     label: "Adult",        sub: "30–44 yrs",  emoji: "👩" },
  { id: "midlife",   label: "Midlife",      sub: "45–59 yrs",  emoji: "🧑‍💼" },
  { id: "senior",    label: "Senior",       sub: "60+ yrs",    emoji: "👴" },
];

export const GENDERS = [
  { id: "female", label: "Female", emoji: "♀" },
  { id: "male",   label: "Male",   emoji: "♂" },
  { id: "other",  label: "Other / Prefer not to say", emoji: "⚬" },
];

export const FEMALE_CONDITIONS = [
  { id: "pregnancy",   label: "Pregnant",         emoji: "🤰" },
  { id: "postpartum",  label: "Postpartum / Nursing", emoji: "🤱" },
  { id: "pcos",        label: "PCOS",             emoji: "🔄" },
  { id: "menopause",   label: "Perimenopause / Menopause", emoji: "🌡️" },
  { id: "none",        label: "None of these",    emoji: "✓" },
];

// General health conditions (shown to everyone) — each maps to nutrition guidance in the prompt
export const HEALTH_CONDITIONS = [
  { id: "none",         label: "None",             emoji: "✓" },
  { id: "diabetes",     label: "Diabetes",         emoji: "🍬" },
  { id: "thyroid",      label: "Thyroid",          emoji: "🦋" },
  { id: "hypertension", label: "High BP",          emoji: "💗" },
  { id: "cholesterol",  label: "High cholesterol", emoji: "🫀" },
  { id: "anemia",       label: "Anemia",           emoji: "🩸" },
  { id: "ibs",          label: "IBS / digestion",  emoji: "🌀" },
  { id: "celiac",       label: "Celiac / gluten",  emoji: "🌾" },
  { id: "kidney",       label: "Kidney issues",    emoji: "🫘" },
  { id: "fatty_liver",  label: "Fatty liver",      emoji: "🫁" },
  { id: "arthritis",    label: "Arthritis / joints", emoji: "🦴" },
];

export const GOALS = [
  { id: "overall",      label: "Overall health",   emoji: "💚", desc: "Balanced nutrition" },
  { id: "weight_loss",  label: "Weight loss",      emoji: "⚖️", desc: "Calorie-conscious" },
  { id: "weight_gain",  label: "Weight gain",      emoji: "💪", desc: "Calorie-dense meals" },
  { id: "hair",         label: "Hair health",      emoji: "✨", desc: "Biotin & protein rich" },
  { id: "skin",         label: "Skin health",      emoji: "🌸", desc: "Antioxidants & collagen" },
  { id: "glow",         label: "Skin glow",        emoji: "☀️", desc: "Vitamin C & hydration" },
  { id: "gut",          label: "Gut health",       emoji: "🌱", desc: "Probiotics & fiber" },
  { id: "energy",       label: "Energy & stamina", emoji: "⚡", desc: "Iron & B vitamins" },
  { id: "bone",         label: "Bone health",      emoji: "🦴", desc: "Calcium & Vitamin D" },
  { id: "immunity",     label: "Immunity boost",   emoji: "🛡️", desc: "Zinc & antioxidants" },
  { id: "hormonal",     label: "Hormonal balance", emoji: "🔮", desc: "Omega-3 & phytoestrogens" },
  { id: "mental",       label: "Mental wellness",  emoji: "🧠", desc: "Omega-3 & magnesium" },
];

export const DIET_TYPES = [
  { id: "vegetarian", label: "Vegetarian", sub: "Includes dairy & eggs", emoji: "🥛" },
  { id: "vegan",      label: "Vegan",      sub: "100% plant-based",      emoji: "🌿" },
];

export const EGG_PREFERENCES = [
  { id: "with_egg", label: "With egg", sub: "Eggs allowed", emoji: "🥚" },
  { id: "eggless",  label: "Eggless",  sub: "No eggs",      emoji: "🚫" },
];

export const KITCHEN_SETUPS = [
  { id: "full",    label: "Full kitchen", sub: "Stove / induction",        emoji: "🍳" },
  { id: "minimal", label: "Minimal",      sub: "Kettle / microwave only",  emoji: "☕" },
  { id: "nocook",  label: "No cooking",   sub: "PG / hostel — ready-to-eat", emoji: "🥗" },
];

export const BUDGETS = [
  { id: "low",    label: "Budget",    sub: "Under ₹200/day",  emoji: "🌱" },
  { id: "medium", label: "Moderate",  sub: "₹200–500/day",    emoji: "🥦" },
  { id: "high",   label: "Premium",   sub: "₹500+/day",       emoji: "✨" },
];

export const ALLERGIES = ["Gluten","Dairy","Nuts","Soy","Eggs","Sesame","Legumes","Nightshades"];

export const RELIGIOUS_PREFS = [
  { id: "none",    label: "No restrictions", sub: "Eat anything plant-based",     emoji: "✓" },
  { id: "jain",    label: "Jain",            sub: "No onion, garlic & root veg",  emoji: "🙏" },
  { id: "sattvic", label: "Sattvic",         sub: "No onion & garlic",            emoji: "🕉️" },
];

// Upcoming fasting/festival observances are fetched live from GET /api/observances
// (Hindu Panchang computed server-side + Ramadan via the Aladhan API). The user
// picks a faith first; `types` decides which observances are shown.
export const FAITHS = [
  { id: "hindu",     label: "Hindu",     emoji: "🕉️", types: ["ekadashi", "pradosh", "sawan_somwar", "navratri"] },
  { id: "muslim",    label: "Muslim",    emoji: "☪️", types: ["ramadan"] },
  { id: "jain",      label: "Jain",      emoji: "🤲", types: ["jain_ashtami", "jain_chaudas"] },
  { id: "christian", label: "Christian", emoji: "✝️", types: ["ash_wednesday", "lent_friday", "good_friday"] },
  { id: "buddhist",  label: "Buddhist",  emoji: "☸️", types: ["uposatha", "buddha_purnima"] },
  { id: "sikh",      label: "Sikh",      emoji: "🪯", types: ["baisakhi", "gurpurab"] },
  { id: "all",       label: "Show all",  emoji: "🗓️", types: ["ekadashi", "pradosh", "sawan_somwar", "navratri", "ramadan", "jain_ashtami", "jain_chaudas", "ash_wednesday", "lent_friday", "good_friday", "uposatha", "buddha_purnima", "baisakhi", "gurpurab"] },
];

export const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export const SEASON_FRUITS = {
  summer:  ["Mango 🥭","Watermelon 🍉","Muskmelon","Litchi","Jamun","Plum"],
  monsoon: ["Pear 🍐","Peach","Cherries","Jamun","Fig","Pomegranate"],
  autumn:  ["Apple 🍎","Pomegranate","Grapes 🍇","Guava","Persimmon"],
  winter:  ["Orange 🍊","Sweet Lime","Strawberry 🍓","Amla","Kiwi 🥝"],
};
