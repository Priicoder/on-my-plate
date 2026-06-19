import { AGE_GROUPS, GENDERS, FEMALE_CONDITIONS, HEALTH_CONDITIONS, DIET_TYPES, EGG_PREFERENCES } from "../../constants/data";
import CardOption from "../common/CardOption";
import Pill from "../common/Pill";
import SLabel from "../common/SLabel";
import NavButtons from "../common/NavButtons";
import "../../styles/steps.css";

// ── STEP 1: Who are you? ──────────────────────────────────────────────────────
export default function Step1({ data, set, onNext }) {
  const toggle = (key, id, multi=false) => {
    if (!multi) { set(key, id); return; }
    const cur = data[key]||[];
    set(key, cur.includes(id) ? cur.filter(x=>x!==id) : [...cur, id]);
  };

  const showConditions = data.gender === "female";
  const showEggPref = data.dietType === "vegetarian";
  const canContinue = data.gender && data.ageGroup && data.dietType &&
    (!showConditions || (data.conditions||[]).length > 0) &&
    (!showEggPref || data.eggPreference);

  const selectDiet = (id) => {
    set("dietType", id);
    // Egg choice only applies to vegetarian — clear it otherwise
    if (id !== "vegetarian") set("eggPreference", "");
  };

  // "None" is mutually exclusive with the other health conditions
  const toggleHealth = (id) => {
    const cur = data.healthConditions || [];
    if (id === "none") { set("healthConditions", cur.includes("none") ? [] : ["none"]); return; }
    const next = cur.filter(x => x !== "none");
    set("healthConditions", next.includes(id) ? next.filter(x=>x!==id) : [...next, id]);
  };

  return (
    <div>
      <h2 className="section-title">Tell us about you</h2>
      <p className="section-sub">We use this to calibrate your nutritional needs.</p>

      <div className="card">
        <SLabel note="This helps us understand your life stage">Age group</SLabel>
        <div className="option-grid option-grid--age">
          {AGE_GROUPS.map(a => <CardOption key={a.id} active={data.ageGroup===a.id} onClick={()=>set("ageGroup",a.id)} emoji={a.emoji} label={a.label} sub={a.sub} />)}
        </div>
      </div>

      <div className="card">
        <SLabel note="Affects calorie & micronutrient recommendations">Biological sex</SLabel>
        <div className="pill-row">
          {GENDERS.map(g => <Pill key={g.id} active={data.gender===g.id} onClick={()=>set("gender",g.id)}>{g.emoji} {g.label}</Pill>)}
        </div>
      </div>

      {showConditions && (
        <div className="card card--alert">
          <SLabel note="Select all that apply — we'll customise nutrition for your needs">Any of these apply to you?</SLabel>
          <div className="option-grid option-grid--auto">
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

      <div className="card">
        <SLabel note="We'll never suggest animal products either way">Diet type</SLabel>
        <div className="option-grid option-grid--two">
          {DIET_TYPES.map(d => <CardOption key={d.id} active={data.dietType===d.id} onClick={()=>selectDiet(d.id)} emoji={d.emoji} label={d.label} sub={d.sub} />)}
        </div>

        {showEggPref && (
          <div className="egg-pref">
            <SLabel note="Should your plan include eggs?">Egg preference</SLabel>
            <div className="option-grid option-grid--two">
              {EGG_PREFERENCES.map(e => <CardOption key={e.id} active={data.eggPreference===e.id} onClick={()=>set("eggPreference",e.id)} emoji={e.emoji} label={e.label} sub={e.sub} />)}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <SLabel note="We'll tailor nutrients to your needs — e.g. selenium for thyroid, low-GI for diabetes">Any health conditions?</SLabel>
        <div className="option-grid option-grid--auto">
          {HEALTH_CONDITIONS.map(c => (
            <CardOption key={c.id}
              active={(data.healthConditions||[]).includes(c.id)}
              onClick={()=>toggleHealth(c.id)}
              emoji={c.emoji} label={c.label} />
          ))}
        </div>
      </div>

      <NavButtons onNext={onNext} disabled={!canContinue} />
    </div>
  );
}
