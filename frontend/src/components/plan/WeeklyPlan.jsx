import { useState } from "react";
import { CUISINES, AGE_GROUPS, GOALS, BUDGETS, DAYS, SEASON_FRUITS } from "../../constants/data";
import { getSeason } from "../../utils/season";
import { generatePrintHTML, triggerPrint } from "../../utils/printPlan";
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

  const season = getSeason();
  const fruits = SEASON_FRUITS[season];

  // Parse AI response — plan is an object keyed by day
  const days = DAYS.map((d,i) => plan[d] || plan[`Day ${i+1}`] || plan[Object.keys(plan)[i]] || {});

  const handlePrint = () => {
    const html = generatePrintHTML(plan, data, days);
    triggerPrint(html);
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
            🖨️ Save / Print
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

      {/* Nav between days */}
      <div className="day-nav">
        <button onClick={()=>setActiveDay(d=>Math.max(0,d-1))} disabled={activeDay===0}
          className="day-nav__btn day-nav__btn--prev">
          ← {activeDay>0 ? DAYS[activeDay-1] : ""}
        </button>
        <button onClick={()=>setActiveDay(d=>Math.min(6,d+1))} disabled={activeDay===6}
          className="day-nav__btn day-nav__btn--next">
          {activeDay<6 ? DAYS[activeDay+1] : ""} →
        </button>
      </div>
    </div>
  );
}
