import { useState } from "react";
import { card, SAGE, SAGE_L, SAGE_M, CLAY, CLAY_L, INK, MUTED, MIST, BORDER } from "../../constants/theme";
import { CUISINES, AGE_GROUPS, GOALS, BUDGETS, DAYS, SEASON_FRUITS } from "../../constants/data";
import { getSeason } from "../../utils/season";
import { generatePrintHTML, triggerPrint } from "../../utils/printPlan";

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
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:500, color:INK, marginBottom:4 }}>Your weekly meal plan</h2>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {[
              data.dietType==="vegan"?"🌿 Vegan":"🥛 Vegetarian",
              CUISINES.find(c=>c.id===data.cuisine)?.label,
              BUDGETS.find(b=>b.id===data.budget)?.label,
              ...(data.goals||[]).map(g=>GOALS.find(x=>x.id===g)?.emoji+" "+GOALS.find(x=>x.id===g)?.label),
            ].filter(Boolean).map((tag,i)=>(
              <span key={i} style={{ fontSize:12, padding:"3px 10px", borderRadius:20, background:SAGE_L, color:SAGE, border:`0.5px solid ${SAGE_M}` }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={handlePrint} style={{ padding:"10px 18px", borderRadius:10, cursor:"pointer", background:SAGE, color:"#fff", border:"none", fontSize:13, fontWeight:500, display:"flex", alignItems:"center", gap:6, boxShadow:`0 4px 12px ${SAGE}44` }}>
            🖨️ Save / Print
          </button>
          <button onClick={onReset} style={{ padding:"10px 16px", borderRadius:10, cursor:"pointer", background:"transparent", border:`1.5px solid ${BORDER}`, fontSize:13, color:MUTED }}>
            Start over
          </button>
        </div>
      </div>

      {/* Day tabs */}
      <div style={{ display:"flex", gap:4, marginTop:20, marginBottom:20, overflowX:"auto", paddingBottom:4 }}>
        {DAYS.map((d,i)=>(
          <button key={d} onClick={()=>setActiveDay(i)} style={{
            padding:"8px 14px", borderRadius:8, border:"none", cursor:"pointer", whiteSpace:"nowrap",
            background: activeDay===i ? SAGE : MIST,
            color: activeDay===i ? "#fff" : MUTED,
            fontWeight: activeDay===i ? 500 : 400,
            fontSize:13, transition:"all 0.15s",
          }}>{d.slice(0,3)}</button>
        ))}
      </div>

      {/* Day content */}
      {(() => {
        const d = days[activeDay];
        return (
          <div style={{ display:"grid", gap:12 }}>
            {[
              { key:"breakfast", label:"Breakfast", emoji:"🌅", bg:"#FFF8ED", border:"#F5D9A8" },
              { key:"lunch",     label:"Lunch",     emoji:"☀️", bg:"#EDF5FF", border:"#B8D4F5" },
              { key:"snack",     label:"Snacks",    emoji:"🍎", bg:SAGE_L,   border:SAGE_M    },
              { key:"dinner",    label:"Dinner",    emoji:"🌙", bg:"#F5EDFF", border:"#D4B8F5" },
            ].map(m=>(
              <div key={m.key} style={{ background:m.bg, border:`1px solid ${m.border}`, borderRadius:14, padding:"16px 18px" }}>
                <div style={{ fontSize:13, fontWeight:500, color:MUTED, marginBottom:6 }}>{m.emoji} {m.label}</div>
                <div style={{ fontSize:14, color:INK, lineHeight:1.6 }}>{d[m.key] || "—"}</div>
              </div>
            ))}
            {d.tip && (
              <div style={{ background:CLAY_L, border:`1px solid #ECC4AB`, borderRadius:14, padding:"14px 18px", display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:18 }}>💡</span>
                <div style={{ fontSize:13, color:CLAY, lineHeight:1.6 }}>{d.tip}</div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Seasonal fruits */}
      <div style={{ ...card, marginTop:16, background:SAGE_L, border:`1px solid ${SAGE_M}` }}>
        <div style={{ fontSize:14, fontWeight:500, color:SAGE, marginBottom:8 }}>
          🍋 Seasonal fruits — {season.charAt(0).toUpperCase()+season.slice(1)} {new Date().getFullYear()}
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:8 }}>
          {fruits.map(f=>(
            <span key={f} style={{ fontSize:13, padding:"5px 12px", borderRadius:20, background:"#fff", border:`1px solid ${SAGE_M}`, color:SAGE }}>{f}</span>
          ))}
        </div>
        <p style={{ fontSize:12, color:MUTED }}>Aim for 2–3 servings daily, between meals — not right before or after eating.</p>
      </div>

      {/* Nav between days */}
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:16 }}>
        <button onClick={()=>setActiveDay(d=>Math.max(0,d-1))} disabled={activeDay===0}
          style={{ padding:"10px 20px", borderRadius:10, border:`1.5px solid ${BORDER}`, background:"transparent", cursor: activeDay===0?"not-allowed":"pointer", color: activeDay===0?MIST:MUTED, fontSize:13 }}>
          ← {activeDay>0 ? DAYS[activeDay-1] : ""}
        </button>
        <button onClick={()=>setActiveDay(d=>Math.min(6,d+1))} disabled={activeDay===6}
          style={{ padding:"10px 20px", borderRadius:10, border:"none", background: activeDay===6?MIST:SAGE, cursor: activeDay===6?"not-allowed":"pointer", color: activeDay===6?MUTED:"#fff", fontSize:13, fontWeight:500 }}>
          {activeDay<6 ? DAYS[activeDay+1] : ""} →
        </button>
      </div>
    </div>
  );
}
