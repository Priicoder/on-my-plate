import { AGE_GROUPS, GOALS, FEMALE_CONDITIONS, CUISINES, BUDGETS } from "../constants/data";
import { getSeason } from "./season";

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

  return `You are a plant-based dietitian. Create a 7-day ${form.dietType} meal plan.
Profile: ${ag} ${form.gender}${conds ? `, ${conds}` : ""}. Goals: ${goals}. Cuisine: ${cuisine}. Budget: ${budget}. Avoid: ${allrg}. Season: ${season}.
Rules: ${form.dietType === "vegan" ? "Strictly vegan (no dairy/eggs/honey)." : "Vegetarian (dairy+eggs ok)."} Keep each meal description under 15 words. Tip under 12 words. No repeated dishes.
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
