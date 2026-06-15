import { card } from "../../constants/theme";
import { AGE_GROUPS, GENDERS, FEMALE_CONDITIONS, DIET_TYPES } from "../../constants/data";
import CardOption from "../common/CardOption";
import Pill from "../common/Pill";
import SLabel from "../common/SLabel";
import NavButtons from "../common/NavButtons";

// ── STEP 1: Who are you? ──────────────────────────────────────────────────────
export default function Step1({ data, set, onNext }) {
  const toggle = (key, id, multi=false) => {
    if (!multi) { set(key, id); return; }
    const cur = data[key]||[];
    set(key, cur.includes(id) ? cur.filter(x=>x!==id) : [...cur, id]);
  };

  const showConditions = data.gender === "female";
  const canContinue = data.gender && data.ageGroup && data.dietType &&
    (!showConditions || (data.conditions||[]).length > 0);

  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:500, color:"#1C1C1C", marginBottom:4 }}>Tell us about you</h2>
      <p style={{ fontSize:14, color:"#7A7670", marginBottom:24 }}>We use this to calibrate your nutritional needs.</p>

      <div style={card}>
        <SLabel note="This helps us understand your life stage">Age group</SLabel>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
          {AGE_GROUPS.map(a => <CardOption key={a.id} active={data.ageGroup===a.id} onClick={()=>set("ageGroup",a.id)} emoji={a.emoji} label={a.label} sub={a.sub} />)}
        </div>
      </div>

      <div style={card}>
        <SLabel note="Affects calorie & micronutrient recommendations">Biological sex</SLabel>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {GENDERS.map(g => <Pill key={g.id} active={data.gender===g.id} onClick={()=>set("gender",g.id)}>{g.emoji} {g.label}</Pill>)}
        </div>
      </div>

      {showConditions && (
        <div style={{ ...card, borderColor: "#E8B4A0", background: "#FBF3EF" }}>
          <SLabel note="Select all that apply — we'll customise nutrition for your needs">Any of these apply to you?</SLabel>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:8 }}>
            {FEMALE_CONDITIONS.map(c => (
              <CardOption key={c.id}
                active={(data.conditions||[]).includes(c.id)}
                onClick={()=>toggle("conditions",c.id,true)}
                emoji={c.emoji} label={c.label}
              />
            ))}
          </div>
        </div>
      )}

      <div style={card}>
        <SLabel note="We'll never suggest animal products either way">Diet type</SLabel>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {DIET_TYPES.map(d => <CardOption key={d.id} active={data.dietType===d.id} onClick={()=>set("dietType",d.id)} emoji={d.emoji} label={d.label} sub={d.sub} />)}
        </div>
      </div>

      <NavButtons onNext={onNext} disabled={!canContinue} />
    </div>
  );
}
