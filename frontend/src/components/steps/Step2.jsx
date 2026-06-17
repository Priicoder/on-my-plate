import { GOALS, CUISINES, BUDGETS, ALLERGIES } from "../../constants/data";
import CardOption from "../common/CardOption";
import Pill from "../common/Pill";
import SLabel from "../common/SLabel";
import NavButtons from "../common/NavButtons";
import "../../styles/steps.css";

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
      <h2 className="section-title">Your goals & preferences</h2>
      <p className="section-sub">Pick what you want to focus on — your meals will reflect it.</p>

      <div className="card">
        <SLabel note="Pick up to 3 focus areas">What's your health goal?</SLabel>
        <div className="option-grid option-grid--auto">
          {GOALS.map(g => {
            const selected = (data.goals||[]).includes(g.id);
            return (
              <button key={g.id}
                onClick={()=>{
                  const cur=data.goals||[];
                  if(cur.includes(g.id)) set("goals",cur.filter(x=>x!==g.id));
                  else if(cur.length<3) set("goals",[...cur,g.id]);
                }}
                className={`goal${selected ? " goal--active" : ""}`}>
                <div className="goal__emoji">{g.emoji}</div>
                <div className="goal__label">{g.label}</div>
                <div className="goal__desc">{g.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card">
        <SLabel note="Your meals will have regional character">Cuisine style</SLabel>
        <div className="option-grid option-grid--auto-sm">
          {CUISINES.map(c => <CardOption key={c.id} active={data.cuisine===c.id} onClick={()=>set("cuisine",c.id)} emoji={c.emoji} label={c.label} />)}
        </div>
      </div>

      <div className="card">
        <SLabel note="Realistic for your kitchen and market access">Daily food budget</SLabel>
        <div className="option-grid option-grid--three">
          {BUDGETS.map(b => <CardOption key={b.id} active={data.budget===b.id} onClick={()=>set("budget",b.id)} emoji={b.emoji} label={b.label} sub={b.sub} />)}
        </div>
      </div>

      <div className="card">
        <SLabel note="Select all that apply">Food allergies or intolerances</SLabel>
        <div className="pill-row">
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
