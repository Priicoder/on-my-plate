import { useState, useEffect } from "react";
import { GOALS, CUISINES, BUDGETS, KITCHEN_SETUPS, ALLERGIES, RELIGIOUS_PREFS, FAITHS } from "../../constants/data";
import CardOption from "../common/CardOption";
import Pill from "../common/Pill";
import SLabel from "../common/SLabel";
import NavButtons from "../common/NavButtons";
import "../../styles/steps.css";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmtDate = (iso) => { const [y,m,d] = iso.split("-").map(Number); return `${d} ${MONTHS[m-1]} ${y}`; };

// ── STEP 2: Goals & cuisine ───────────────────────────────────────────────────
export default function Step2({ data, set, onNext, onBack }) {
  const [observances, setObservances] = useState([]);
  const [obsState, setObsState] = useState("loading"); // loading | ready | error

  // Pull the upcoming fasting/festival calendar (Hindu Panchang computed + Ramadan via API)
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL; // || "http://localhost:5000"
    fetch(`${API_BASE}/api/observances`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then(d => { setObservances(d.events || []); setObsState("ready"); })
      .catch(() => setObsState("error"));
  }, []);

  const toggle = (key, id, multi=false) => {
    if (!multi) { set(key, id); return; }
    const cur = data[key]||[];
    set(key, cur.includes(id) ? cur.filter(x=>x!==id) : [...cur, id]);
  };

  // "No restrictions" is mutually exclusive with the others
  const toggleReligious = (id) => {
    const cur = data.religiousPrefs || [];
    if (id === "none") { set("religiousPrefs", cur.includes("none") ? [] : ["none"]); return; }
    const next = cur.filter(x => x !== "none");
    set("religiousPrefs", next.includes(id) ? next.filter(x=>x!==id) : [...next, id]);
  };

  // Select/deselect a dated observance — we store the whole event so the plan
  // can tag the matching weekday(s) and tailor that day's food.
  const toggleEvent = (ev) => {
    const cur = data.observanceEvents || [];
    set("observanceEvents", cur.some(e => e.id === ev.id) ? cur.filter(e => e.id !== ev.id) : [...cur, ev]);
  };

  // Ask faith first; only show its observances and drop selections from other faiths
  const faithTypes = FAITHS.find(f => f.id === data.faith)?.types || [];
  const visibleObservances = observances.filter(o => faithTypes.includes(o.type));
  const selectFaith = (id) => {
    set("faith", id);
    const types = FAITHS.find(f => f.id === id)?.types || [];
    set("observanceEvents", (data.observanceEvents || []).filter(e => types.includes(e.type)));
  };

  const canContinue = (data.goals||[]).length > 0 && data.cuisine && data.budget && data.kitchen;

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
        <SLabel note="So we only suggest meals you can actually make">Kitchen setup</SLabel>
        <div className="option-grid option-grid--three">
          {KITCHEN_SETUPS.map(k => <CardOption key={k.id} active={data.kitchen===k.id} onClick={()=>set("kitchen",k.id)} emoji={k.emoji} label={k.label} sub={k.sub} />)}
        </div>
      </div>

      <div className="card">
        <SLabel note="We'll respect these in every meal">Religious or cultural preferences</SLabel>
        <div className="option-grid option-grid--three">
          {RELIGIOUS_PREFS.map(r => (
            <CardOption key={r.id}
              active={(data.religiousPrefs||[]).includes(r.id)}
              onClick={()=>toggleReligious(r.id)}
              emoji={r.emoji} label={r.label} sub={r.sub} />
          ))}
        </div>

        <div className="egg-pref">
          <SLabel note="Tell us your faith and we'll show the relevant upcoming fasting days">Fasting & observances</SLabel>
          <div className="pill-row">
            {FAITHS.map(f => (
              <Pill key={f.id} active={data.faith===f.id} onClick={()=>selectFaith(f.id)}>
                {f.emoji} {f.label}
              </Pill>
            ))}
          </div>

          {data.faith && (
            <div className="egg-pref">
              <SLabel note="Pick any to tailor those days">Upcoming fasting days & festivals</SLabel>
              {obsState === "loading" && <p className="obs-msg">Loading upcoming dates…</p>}
              {obsState === "error" && <p className="obs-msg">Couldn't load the calendar — you can still continue without it.</p>}
              {obsState === "ready" && visibleObservances.length === 0 && <p className="obs-msg">No upcoming dates found for this selection.</p>}
              {obsState === "ready" && visibleObservances.length > 0 && (
                <>
                  <div className="obs-list">
                    {visibleObservances.map(ev => {
                      const active = (data.observanceEvents||[]).some(e => e.id === ev.id);
                      return (
                        <button key={ev.id} onClick={()=>toggleEvent(ev)}
                          className={`obs-item${active ? " obs-item--active" : ""}`}>
                          <span className="obs-item__emoji">{ev.emoji}</span>
                          <span className="obs-item__body">
                            <span className="obs-item__name">{ev.name}{ev.days ? ` · ${ev.days} days` : ""}</span>
                            <span className="obs-item__date">{ev.weekday}, {fmtDate(ev.date)}</span>
                          </span>
                          <span className="obs-item__check">{active ? "✓" : ""}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="obs-note">Panchang dates are computed and may be ±1 day — verify locally for strict observance.</p>
                </>
              )}
            </div>
          )}
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
