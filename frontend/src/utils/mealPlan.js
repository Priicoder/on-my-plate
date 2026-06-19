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

  const days = (form.fastingDays || []).join(", ");
  let observanceRule = "";
  switch (form.observance) {
    case "sattvic_days":
      if (days) observanceRule = `On ONLY these days (${days}) serve light, simple sattvic meals — no onion or garlic, easy to digest, lighter portions. Note "light/sattvic" in the tip for those days.`;
      break;
    case "vrat_days":
      if (days) observanceRule = `On ONLY these days (${days}) all meals must be vrat/falahari food (fruits, sabudana, samak/barnyard millet, sendha namak, dairy, nuts); avoid grains, wheat, rice, lentils, regular salt, onion and garlic. Note "vrat" in the tip for those days.`;
      break;
    case "navratri":
      observanceRule = `This is a 9-day Navratri fast: EVERY meal on all 7 days must be falahari/vrat food — kuttu (buckwheat) flour, singhara (water chestnut) flour, samak rice, sabudana, potato, fruits, dairy, nuts, sendha namak; NO grains, wheat, rice, lentils, regular salt, onion or garlic.`;
      break;
    case "ramadan":
      observanceRule = `This is Ramadan (Roza), fasting dawn to sunset. Restructure each day: "breakfast" = Sehri (pre-dawn, filling, slow-energy, hydrating), "lunch" = "Fasting (no food/water)", "snack" = Iftar opening (dates, water, fruit), "dinner" = Iftar main meal. Prioritise hydration and slow-release energy; note Sehri/Iftar in the tip.`;
      break;
    default:
      observanceRule = "";
  }

  return `You are a plant-based dietitian. Create a 7-day ${form.dietType} meal plan.
Profile: ${ag} ${form.gender}${conds ? `, ${conds}` : ""}. Goals: ${goals}. Cuisine: ${cuisine}. Budget: ${budget}. Avoid: ${allrg}. Season: ${season}.${health ? `\nMedical considerations (tailor meals accordingly): ${health}.` : ""}
Rules: ${form.dietType === "vegan" ? "Strictly vegan (no dairy/eggs/honey)." : form.eggPreference === "eggless" ? "Vegetarian, eggless (dairy ok, NO eggs)." : "Vegetarian (dairy+eggs ok)."}${religiousRules ? " " + religiousRules : ""}${observanceRule ? " " + observanceRule : ""} Keep each meal description under 15 words. Tip under 12 words. No repeated dishes.
Return ONLY raw JSON, no markdown, no extra text:
{"Monday":{"breakfast":"","lunch":"","snack":"","dinner":"","tip":""},"Tuesday":{"breakfast":"","lunch":"","snack":"","dinner":"","tip":""},"Wednesday":{"breakfast":"","lunch":"","snack":"","dinner":"","tip":""},"Thursday":{"breakfast":"","lunch":"","snack":"","dinner":"","tip":""},"Friday":{"breakfast":"","lunch":"","snack":"","dinner":"","tip":""},"Saturday":{"breakfast":"","lunch":"","snack":"","dinner":"","tip":""},"Sunday":{"breakfast":"","lunch":"","snack":"","dinner":"","tip":""}}`;
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
