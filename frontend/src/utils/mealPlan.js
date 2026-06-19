import { AGE_GROUPS, GOALS, FEMALE_CONDITIONS, CUISINES, BUDGETS } from "../constants/data";
import { getSeason } from "./season";

// Nutrition guidance per health condition — fed into the prompt so meals are tailored
const HEALTH_GUIDANCE = {
  diabetes:     "diabetes: low glycemic index, high fiber, no added sugar or refined carbs, balanced complex carbs",
  thyroid:      "thyroid: include selenium-rich foods (brazil nuts, pumpkin seeds), iodine and zinc; limit raw goitrogens (raw cabbage, excess soy)",
  hypertension: "high blood pressure: low sodium, potassium-rich foods (banana, leafy greens), DASH-style meals",
  cholesterol:  "high cholesterol: soluble fiber (oats, beans, flaxseed), nuts; avoid fried and saturated fats",
  anemia:       "anemia: iron-rich foods (spinach, lentils, jaggery, dates) paired with vitamin C for absorption",
  ibs:          "IBS: gentle, low-FODMAP-friendly, easy to digest, avoid heavy spices and fried food",
  celiac:       "celiac: strictly gluten-free — no wheat, barley or rye",
  kidney:       "kidney issues: moderate protein, control potassium and sodium",
  fatty_liver:  "fatty liver: low fat, high fiber, no fried or sugary foods",
  arthritis:    "arthritis/joints: anti-inflammatory foods (turmeric, omega-3 seeds, berries), avoid fried/processed",
};

export const buildPrompt = (form) => {
  const ag = AGE_GROUPS.find(a => a.id === form.ageGroup)?.label || form.ageGroup;
  const goals = (form.goals || []).map(g => GOALS.find(x => x.id === g)?.label).join(", ");
  const conds = (form.conditions || [])
    .filter(c => c !== "none")
    .map(c => FEMALE_CONDITIONS.find(x => x.id === c)?.label)
    .join(", ");
  const allrg = (form.allergies || []).join(", ") || "none";
  const cuisine = CUISINES.find(c => c.id === form.cuisine)?.label || form.cuisine;
  const budget = BUDGETS.find(b => b.id === form.budget)?.label || form.budget;
  const season = getSeason();

  const health = (form.healthConditions || [])
    .filter(h => h !== "none")
    .map(h => HEALTH_GUIDANCE[h])
    .filter(Boolean)
    .join("; ");

  const religious = (form.religiousPrefs || []).filter(r => r !== "none");
  const religiousRules = religious.map(r => {
    if (r === "jain") return "Strictly Jain: no onion, garlic, potato or any root vegetables (no carrot, radish, beetroot, ginger root).";
    if (r === "sattvic") return "Sattvic: no onion or garlic.";
    return "";
  }).filter(Boolean).join(" ");

  // Selected fasting/festival events from the calendar — single-day ones tag their
  // weekday; Navratri/Ramadan span the whole plan.
  const events = form.observanceEvents || [];
  const DAY_RULE = {
    // Hindu
    ekadashi: "vrat/falahari food (fruits, sabudana, samak rice, sendha namak, dairy, nuts) — no grains, rice, wheat, lentils, regular salt, onion or garlic",
    pradosh: "light sattvic fasting food eaten after sunset — no onion or garlic, light dinner",
    sawan_somwar: "sattvic Monday vrat — light and falahari-friendly, no onion or garlic",
    // Jain
    jain_ashtami: "Jain fast — plain, simple food eaten before sunset; no root vegetables and no green/leafy vegetables (many observe upvas with only fruit and water)",
    jain_chaudas: "Jain fast — plain, simple food eaten before sunset; no root vegetables and no green/leafy vegetables",
    // Christian
    ash_wednesday: "Christian fast — one modest, simple, meat-free meal and lighter eating through the day",
    lent_friday: "Lenten Friday — simple, modest, meat-free meals",
    good_friday: "Good Friday — simple, light, meat-free meals; abstinence and reflection",
    // Buddhist
    uposatha: "Buddhist Uposatha — light vegetarian meals; stricter observers take nothing after noon",
    buddha_purnima: "Buddha Purnima (Vesak) — simple sattvic vegetarian meals",
    // Sikh
    gurpurab: "Gurpurab — festive langar-style simple vegetarian meal (dal, sabzi, roti, kheer)",
    baisakhi: "Baisakhi — festive vegetarian harvest meal",
  };

  const byDay = {};
  events.filter(e => DAY_RULE[e.type]).forEach(e => {
    (byDay[e.weekday] = byDay[e.weekday] || []).push(`${e.name} (${DAY_RULE[e.type]})`);
  });
  const dayRules = Object.entries(byDay)
    .map(([wd, list]) => `On ${wd}: ${[...new Set(list)].join("; ")} — note it in that day's tip.`)
    .join(" ");

  let weekRule = "";
  if (events.some(e => e.type === "navratri")) {
    weekRule += `Navratri fast is on: EVERY meal on all 7 days must be falahari — kuttu (buckwheat), singhara (water chestnut), samak rice, sabudana, potato, fruits, dairy, nuts, sendha namak; NO grains, wheat, rice, lentils, regular salt, onion or garlic. `;
  }
  if (events.some(e => e.type === "ramadan")) {
    weekRule += `Ramadan (Roza) is on: each day "breakfast" = Sehri (pre-dawn, filling, hydrating), "lunch" = "Fasting (no food/water)", "snack" = Iftar opening (dates, water, fruit), "dinner" = Iftar main meal. Prioritise hydration and slow-release energy; note Sehri/Iftar in the tip. `;
  }

  const observanceRule = (weekRule + dayRules).trim();

  const PATTERN_RULE = {
    keto: "Follow a KETO pattern: very low carb (~20–30g/day), high healthy fats (avocado, nuts, seeds, coconut, olive oil), moderate protein; avoid grains, rice, sugar, starchy vegetables and most fruit.",
    high_protein: "High-protein pattern: prioritise protein in every meal (legumes, tofu, tempeh, soya, paneer, dairy, nuts, seeds).",
    low_carb: "Low-carb pattern: minimise grains, rice, sugar and starchy foods; emphasise vegetables, protein and healthy fats.",
    intermittent: 'Intermittent fasting (16:8): meals only within an 8-hour window — set "breakfast" = "Fasting (water / black coffee / green tea)" and place real meals in lunch, snack and an earlier dinner. Note the eating window in tips.',
    liquid: "Liquid diet: ALL meals must be liquids only — smoothies, fresh juices, blended shakes, dal/vegetable soups, buttermilk; no solid foods.",
  };
  const patternRule = PATTERN_RULE[form.dietPattern] || "";

  let kitchenRule = "";
  if (form.kitchen === "minimal") {
    kitchenRule = "Kitchen: only a kettle/microwave — NO stovetop. Use no-cook or boil-water/microwave-only methods: overnight/soaked oats, instant items, microwaveable dishes, salads, sandwiches; nothing needing a stove, pan, or oven.";
  } else if (form.kitchen === "nocook") {
    kitchenRule = "Kitchen: NONE (PG/hostel) — suggest only ready-to-eat, NO-COOK meals needing zero heat: fruits, salads, sprouts, curd/yogurt, milk, overnight oats, dry fruits, nuts, peanut butter, whole-grain bread/sandwiches, hummus, paneer cubes, and healthy ready-to-eat packaged options. No recipe may require a stove, microwave, oven, or even hot water.";
  }

  return `You are a plant-based dietitian. Create a 7-day ${form.dietType} meal plan.
Profile: ${ag} ${form.gender}${conds ? `, ${conds}` : ""}. Goals: ${goals}. Cuisine: ${cuisine}. Budget: ${budget}. Avoid: ${allrg}. Season: ${season}.${health ? `\nMedical considerations (tailor meals accordingly): ${health}.` : ""}
Rules: ${form.dietType === "vegan" ? "Strictly vegan (no dairy/eggs/honey)." : form.eggPreference === "eggless" ? "Vegetarian, eggless (dairy ok, NO eggs)." : "Vegetarian (dairy+eggs ok)."}${patternRule ? " " + patternRule : ""}${religiousRules ? " " + religiousRules : ""}${kitchenRule ? " " + kitchenRule : ""}${observanceRule ? " " + observanceRule : ""} Keep each meal description under 15 words. Tip under 12 words. No repeated dishes.
Return ONLY raw JSON, no markdown, no extra text:
{"Monday":{"breakfast":"","lunch":"","snack":"","dinner":"","tip":""},"Tuesday":{"breakfast":"","lunch":"","snack":"","dinner":"","tip":""},"Wednesday":{"breakfast":"","lunch":"","snack":"","dinner":"","tip":""},"Thursday":{"breakfast":"","lunch":"","snack":"","dinner":"","tip":""},"Friday":{"breakfast":"","lunch":"","snack":"","dinner":"","tip":""},"Saturday":{"breakfast":"","lunch":"","snack":"","dinner":"","tip":""},"Sunday":{"breakfast":"","lunch":"","snack":"","dinner":"","tip":""}}`;
};

// Asks the model to roll the 7-day plan up into one categorised weekly shopping list
export const buildGroceryPrompt = (plan) => {
  return `From this 7-day meal plan, create ONE consolidated weekly grocery shopping list for a single person. Combine duplicate ingredients across all days into a single line with an approximate total quantity (metric). Group items by category.
Plan JSON: ${JSON.stringify(plan)}
Return ONLY raw JSON, no markdown, no extra text, in exactly this shape (use an empty array for any category with no items):
{"Vegetables":["item — qty"],"Fruits":["item — qty"],"Grains & flours":["item — qty"],"Pulses & legumes":["item — qty"],"Dairy & alternatives":["item — qty"],"Nuts & seeds":["item — qty"],"Pantry & spices":["item — qty"]}`;
};

export const repairJSON = (raw) => {
  // Strip markdown fences
  let s = raw.replace(/```json|```/g, "").trim();
  // Try direct parse first
  try { return JSON.parse(s); } catch (_) {}
  // Find first { and last complete }
  const start = s.indexOf("{");
  if (start === -1) throw new Error("No JSON object found in response");
  s = s.slice(start);
  // Count braces to find where JSON ends or got truncated
  let depth = 0, end = -1;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "{") depth++;
    else if (s[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end !== -1) {
    try { return JSON.parse(s.slice(0, end + 1)); } catch (_) {}
  }
  // Truncated — close open strings/braces
  let fixed = s;
  const lastQuote = fixed.lastIndexOf('"');
  const lastColon = fixed.lastIndexOf(':');
  if (lastColon > lastQuote) {
    fixed = fixed + '"';
  }
  let opens = 0;
  for (const ch of fixed) { if (ch === "{") opens++; else if (ch === "}") opens--; }
  fixed = fixed.replace(/[,:\s]+$/, "");
  fixed += "}".repeat(Math.max(0, opens));
  try { return JSON.parse(fixed); } catch (e2) {
    throw new Error("Could not parse meal plan. Please try again.");
  }
};
