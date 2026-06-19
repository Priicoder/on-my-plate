import { CUISINES, AGE_GROUPS, GOALS, DAYS, SEASON_FRUITS } from "../constants/data";
import { getSeason } from "./season";

export const generatePrintHTML = (plan, data, days) => {
  const season = getSeason();
  const fruits = SEASON_FRUITS[season];

  const cuisineLabel = CUISINES.find(c => c.id === data.cuisine)?.label || data.cuisine;
  const ageLabel = AGE_GROUPS.find(a => a.id === data.ageGroup)?.label || data.ageGroup;
  const goalLabels = (data.goals || []).map(g => GOALS.find(x => x.id === g)?.label || g).join(", ");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>On My Plate — Weekly Diet Chart</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;padding:36px;color:#1C1C1C;max-width:860px;margin:0 auto;font-size:13px}
    .brand{font-size:22px;font-weight:700;color:#4A7C59;margin-bottom:3px}
    .tagline{font-size:11px;color:#7A7670;margin-bottom:10px}
    .tags{margin-bottom:20px;line-height:2}
    .tag{display:inline-block;background:#EAF3EC;color:#4A7C59;padding:2px 9px;border-radius:20px;margin:2px;font-size:11px}
    .title{font-size:18px;font-weight:700;margin-bottom:20px;color:#1C1C1C}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .day-block{border:1px solid #d0e8d8;border-radius:10px;padding:14px;break-inside:avoid}
    .day-title{font-size:13px;font-weight:700;color:#4A7C59;border-bottom:1px solid #d0e8d8;padding-bottom:7px;margin-bottom:10px}
    .meal{margin-bottom:7px}
    .meal-label{font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:#7A7670;margin-bottom:2px}
    .meal-text{font-size:12px;color:#1C1C1C;line-height:1.45}
    .tip{font-size:11px;color:#C96B3A;background:#FBF0EA;padding:6px 10px;border-radius:6px;margin-top:8px}
    .fruits-section{margin-top:20px;padding:14px;background:#EAF3EC;border-radius:10px}
    .fruits-title{font-size:13px;font-weight:700;color:#4A7C59;margin-bottom:8px}
    .fruit{display:inline-block;background:#fff;color:#4A7C59;padding:3px 10px;border-radius:14px;margin:3px;font-size:11px;border:1px solid #B8D9BF}
    .footer{margin-top:24px;padding-top:12px;border-top:1px solid #eee;font-size:10px;color:#aaa;line-height:1.6}
    @media print{
      body{padding:20px}
      .grid{grid-template-columns:1fr 1fr}
      .day-block{break-inside:avoid;page-break-inside:avoid}
    }
  </style></head><body>
  <div class="brand">🌿 On My Plate</div>
  <div class="tagline">personalised plant-based nutrition</div>
  <div class="tags">
    <span class="tag">${data.dietType === "vegan" ? "🌿 Vegan" : "🥛 Vegetarian"}</span>
    <span class="tag">${cuisineLabel}</span>
    <span class="tag">${ageLabel}</span>
    <span class="tag">${goalLabels}</span>
    ${(data.allergies || []).length ? `<span class="tag">No: ${data.allergies.join(", ")}</span>` : ""}
  </div>
  <div class="title">7-day personalised meal plan</div>
  <div class="grid">
  ${DAYS.map((day, i) => {
    const d = days[i];
    return `<div class="day-block">
      <div class="day-title">${day}</div>
      ${["breakfast", "lunch", "snack", "dinner"].map(m => `
        <div class="meal">
          <div class="meal-label">${m === "snack" ? "Snacks" : m.charAt(0).toUpperCase() + m.slice(1)}</div>
          <div class="meal-text">${(d[m] || "—").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        </div>`).join("")}
      ${d.tip ? `<div class="tip">💡 ${d.tip.replace(/</g, "&lt;")}</div>` : ""}
    </div>`;
  }).join("")}
  </div>
  <div class="fruits-section">
    <div class="fruits-title">🍋 Seasonal fruits — ${season.charAt(0).toUpperCase() + season.slice(1)}</div>
    ${fruits.map(f => `<span class="fruit">${f}</span>`).join("")}
    <p style="font-size:11px;color:#7A7670;margin-top:8px">Have 2–3 servings daily between meals.</p>
  </div>
  <div class="footer">
    Generated ${new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}<br>
    On My Plate · This is a general nutritional guide. Please consult a registered dietitian for personalised medical advice.
  </div>
  </body></html>`;
};

export const generateGroceryPrintHTML = (groceries) => {
  const esc = (s) => String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const cats = Object.entries(groceries || {}).filter(([, items]) => Array.isArray(items) && items.length > 0);

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>On My Plate — Weekly Grocery List</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;padding:36px;color:#1C1C1C;max-width:760px;margin:0 auto;font-size:13px}
    .brand{font-size:22px;font-weight:700;color:#4A7C59;margin-bottom:3px}
    .tagline{font-size:11px;color:#7A7670;margin-bottom:20px}
    .title{font-size:18px;font-weight:700;margin-bottom:20px;color:#1C1C1C}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .cat{border:1px solid #d0e8d8;border-radius:10px;padding:14px;break-inside:avoid}
    .cat-title{font-size:13px;font-weight:700;color:#4A7C59;border-bottom:1px solid #d0e8d8;padding-bottom:7px;margin-bottom:10px}
    .item{font-size:12px;color:#1C1C1C;line-height:1.7;padding-left:14px;position:relative}
    .item::before{content:"☐";position:absolute;left:0;color:#4A7C59}
    .footer{margin-top:24px;padding-top:12px;border-top:1px solid #eee;font-size:10px;color:#aaa;line-height:1.6}
    @media print{body{padding:20px}.cat{break-inside:avoid;page-break-inside:avoid}}
  </style></head><body>
  <div class="brand">🌿 On My Plate</div>
  <div class="tagline">personalised plant-based nutrition</div>
  <div class="title">🛒 Weekly grocery list</div>
  <div class="grid">
  ${cats.map(([cat, items]) => `<div class="cat">
      <div class="cat-title">${esc(cat)}</div>
      ${items.map(it => `<div class="item">${esc(it)}</div>`).join("")}
    </div>`).join("")}
  </div>
  <div class="footer">
    Generated ${new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}<br>
    On My Plate · Approximate weekly quantities for one person.
  </div>
  </body></html>`;
};

export const triggerPrint = (html) => {
  let iframe = document.getElementById("omp-print-frame");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "omp-print-frame";
    iframe.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:9999;background:#fff";
    document.body.appendChild(iframe);
  }
  iframe.srcdoc = html;
  iframe.onload = () => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      const blob = new Blob([html], { type: "text/html" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "OnMyPlate-WeeklyDietChart.html";
      a.click();
    }
    setTimeout(() => { iframe.remove(); }, 3000);
  };
};
