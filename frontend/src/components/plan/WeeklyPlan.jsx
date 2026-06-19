import { useState } from "react";
import { CUISINES, AGE_GROUPS, GOALS, BUDGETS, DAYS, SEASON_FRUITS } from "../../constants/data";
import { getSeason } from "../../utils/season";
import { generatePrintHTML, generateGroceryPrintHTML, triggerPrint } from "../../utils/printPlan";
import { buildGroceryPrompt, repairJSON } from "../../utils/mealPlan";
import "../../styles/WeeklyPlan.css";

const MEALS = [
  { key: "breakfast", label: "Breakfast", emoji: "🌅" },
  { key: "lunch",     label: "Lunch",     emoji: "☀️" },
  { key: "snack",     label: "Snacks",    emoji: "🍎" },
  { key: "dinner",    label: "Dinner",    emoji: "🌙" },
];

// ── RESULT: Weekly plan ────────────────────────────────────────────────────────
export default function WeeklyPlan({ plan, data, onReset }) {
  const [activeDay, setActiveDay] = useState(0);

  // Groceries: lazy-generated from the plan on demand, then cached
  const [groceries, setGroceries] = useState(null);
  const [gLoading, setGLoading] = useState(false);
  const [gError, setGError] = useState(false);
  const [gOpen, setGOpen] = useState(false);

  const season = getSeason();
  const fruits = SEASON_FRUITS[season];

  // Parse AI response — plan is an object keyed by day
  const days = DAYS.map((d,i) => plan[d] || plan[`Day ${i+1}`] || plan[Object.keys(plan)[i]] || {});

  const handlePrint = () => {
    const html = generatePrintHTML(plan, data, days);
    triggerPrint(html);
  };

  const handleGroceryPrint = () => {
    if (groceries) triggerPrint(generateGroceryPrintHTML(groceries));
  };

  const loadGroceries = async () => {
    setGLoading(true); setGError(false);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/api/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildGroceryPrompt(plan) }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const body = await res.json();
      setGroceries(repairJSON((body.text || "").trim()));
    } catch (e) {
      setGError(true);
    } finally {
      setGLoading(false);
    }
  };

  const toggleGroceries = () => {
    if (groceries) { setGOpen(o => !o); return; }
    setGOpen(true);
    loadGroceries();
  };

  return (
    <div>
      {/* Header */}
      <div className="plan-header">
        <div>
          <h2 className="plan-title">Your weekly meal plan</h2>
          <div className="plan-tags">
            {[
              data.dietType==="vegan"?"🌿 Vegan":"🥛 Vegetarian",
              CUISINES.find(c=>c.id===data.cuisine)?.label,
              BUDGETS.find(b=>b.id===data.budget)?.label,
              ...(data.goals||[]).map(g=>GOALS.find(x=>x.id===g)?.emoji+" "+GOALS.find(x=>x.id===g)?.label),
            ].filter(Boolean).map((tag,i)=>(
              <span key={i} className="plan-tag">{tag}</span>
            ))}
          </div>
        </div>
        <div className="plan-actions">
          <button onClick={handlePrint} className="btn-print">
            🖨️ Save
          </button>
          <button onClick={onReset} className="btn-reset">
            Start over
          </button>
        </div>
      </div>

      {/* Day tabs */}
      <div className="day-tabs">
        {DAYS.map((d,i)=>(
          <button key={d} onClick={()=>setActiveDay(i)}
            className={`day-tab${activeDay===i ? " day-tab--active" : ""}`}>{d.slice(0,3)}</button>
        ))}
      </div>

      {/* Day content */}
      {(() => {
        const d = days[activeDay];
        return (
          <div className="meals">
            {MEALS.map(m=>(
              <div key={m.key} className={`meal meal--${m.key}`}>
                <div className="meal__label">{m.emoji} {m.label}</div>
                <div className="meal__text">{d[m.key] || "—"}</div>
              </div>
            ))}
            {d.tip && (
              <div className="tip">
                <span className="tip__icon">💡</span>
                <div className="tip__text">{d.tip}</div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Seasonal fruits */}
      <div className="card season">
        <div className="season__title">
          🍋 Seasonal fruits — {season.charAt(0).toUpperCase()+season.slice(1)} {new Date().getFullYear()}
        </div>
        <div className="season__fruits">
          {fruits.map(f=>(
            <span key={f} className="season__fruit">{f}</span>
          ))}
        </div>
        <p className="season__note">Aim for 2–3 servings daily, between meals — not right before or after eating.</p>
      </div>

      {/* Required groceries */}
      <div className="grocery-actions">
        <button onClick={toggleGroceries} className="btn-print">
          🛒 {gOpen && groceries ? "Hide groceries" : "Required groceries"}
        </button>
      </div>

      {gOpen && (
        <div className="card grocery">
          <div className="grocery__head">
            <div className="grocery__title">🛒 Weekly grocery list</div>
            {groceries && !gLoading && (
              <button onClick={handleGroceryPrint} className="btn-print">🖨️ Save</button>
            )}
          </div>
          {gLoading && <p className="grocery__msg">Gathering your ingredients…</p>}
          {gError && (
            <p className="grocery__msg">
              Couldn't generate the list. <button className="grocery__retry" onClick={loadGroceries}>Try again</button>
            </p>
          )}
          {groceries && !gLoading && (
            <div className="grocery__grid">
              {Object.entries(groceries)
                .filter(([, items]) => Array.isArray(items) && items.length > 0)
                .map(([cat, items]) => (
                  <div key={cat} className="grocery__cat">
                    <div className="grocery__cat-title">{cat}</div>
                    <ul className="grocery__list">
                      {items.map((it, i) => <li key={i}>{it}</li>)}
                    </ul>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
