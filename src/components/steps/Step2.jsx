import { card, SAGE, SAGE_L, BORDER, INK, MUTED } from "../../constants/theme";
import { GOALS, CUISINES, BUDGETS, ALLERGIES } from "../../constants/data";
import CardOption from "../common/CardOption";
import Pill from "../common/Pill";
import SLabel from "../common/SLabel";
import NavButtons from "../common/NavButtons";

// ── STEP 2: Goals & cuisine ───────────────────────────────────────────────────
export default function Step2({ data, set, onNext, onBack }) {
  const toggle = (key, id, multi=false) => {
    if (!multi) { set(key, id); return; }
    const cur = data[key]||[];
    set(key, cur.includes(id) ? cur.filter(x=>x!==id) : [...cur, id]);
  };

  const canContinue = (data.goals||[]).length > 0 && data.cuisine && data.budget;

  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:500, color:INK, marginBottom:4 }}>Your goals & preferences</h2>
      <p style={{ fontSize:14, color:MUTED, marginBottom:24 }}>Pick what you want to focus on — your meals will reflect it.</p>

      <div style={card}>
        <SLabel note="Pick up to 3 focus areas">What's your health goal?</SLabel>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:8 }}>
          {GOALS.map(g => (
            <button key={g.id}
              onClick={()=>{
                const cur=data.goals||[];
                if(cur.includes(g.id)) set("goals",cur.filter(x=>x!==g.id));
                else if(cur.length<3) set("goals",[...cur,g.id]);
              }}
              style={{
                padding:"13px 10px", borderRadius:12, textAlign:"center", cursor:"pointer", outline:"none",
                border: (data.goals||[]).includes(g.id) ? `2px solid ${SAGE}` : `1.5px solid ${BORDER}`,
                background: (data.goals||[]).includes(g.id) ? SAGE_L : "#fff",
                transition:"all 0.15s",
              }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{g.emoji}</div>
              <div style={{ fontSize:13, fontWeight:500, color:(data.goals||[]).includes(g.id)?SAGE:INK }}>{g.label}</div>
              <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>{g.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={card}>
        <SLabel note="Your meals will have regional character">Cuisine style</SLabel>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:8 }}>
          {CUISINES.map(c => <CardOption key={c.id} active={data.cuisine===c.id} onClick={()=>set("cuisine",c.id)} emoji={c.emoji} label={c.label} />)}
        </div>
      </div>

      <div style={card}>
        <SLabel note="Realistic for your kitchen and market access">Daily food budget</SLabel>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {BUDGETS.map(b => <CardOption key={b.id} active={data.budget===b.id} onClick={()=>set("budget",b.id)} emoji={b.emoji} label={b.label} sub={b.sub} />)}
        </div>
      </div>

      <div style={card}>
        <SLabel note="Select all that apply">Food allergies or intolerances</SLabel>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {ALLERGIES.map(a=>(
            <Pill key={a} active={(data.allergies||[]).includes(a)} onClick={()=>toggle("allergies",a,true)}>
              {a}
            </Pill>
          ))}
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} disabled={!canContinue} />
    </div>
  );
}
