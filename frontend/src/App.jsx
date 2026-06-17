import { useState } from "react";
import { DAYS } from "./constants/data";
import { buildPrompt, repairJSON } from "./utils/mealPlan";
import Progress from "./components/common/Progress";
import Loader from "./components/common/Loader";
import ErrorView from "./components/common/ErrorView";
import Step1 from "./components/steps/Step1";
import Step2 from "./components/steps/Step2";
import WeeklyPlan from "./components/plan/WeeklyPlan";

const EMPTY_FORM = { ageGroup:"", gender:"", conditions:[], dietType:"", goals:[], cuisine:"", budget:"", allergies:[] };

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]     = useState(0);  // 0,1=form steps; 3=loading; 4=result; 5=error
  const [form, setForm]     = useState(EMPTY_FORM);
  const [plan, setPlan]     = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const set = (key, val) => setForm(f=>({...f,[key]:val}));

  const generate = async () => {
    setStep(3);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/api/plan`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ prompt: buildPrompt(form) }),
      });
      if (!res.ok) {
        const errBody = await res.text().catch(()=>"");
        throw new Error(`API error ${res.status}${errBody? ": "+errBody.slice(0,120):""}`);
      }
      const data = await res.json();
      const raw = (data.text || "").trim();
      const parsed = repairJSON(raw);
      // Ensure all 7 days exist with fallback
      const keys = Object.keys(parsed);
      const complete = {};
      DAYS.forEach((d,i) => {
        complete[d] = parsed[d] || parsed[keys[i]] || { breakfast:"—", lunch:"—", snack:"—", dinner:"—", tip:"" };
      });
      setPlan(complete);
      setStep(4);
    } catch(e) {
      setErrMsg(e.message||"Could not generate your plan.");
      setStep(5);
    }
  };

  return (
    <div className="app">
      {/* Top bar */}
      <div className="topbar">
        <div className="topbar__inner">
          <div className="brand">
            <span className="brand__logo">🌿</span>
            <div>
              <div className="brand__name">On My Plate</div>
              <div className="brand__tag">personalised plant-based nutrition</div>
            </div>
          </div>
          {step < 3 && <span className="topbar__note">Free · No sign-up · Private</span>}
        </div>
      </div>

      {/* Body */}
      <div className="container">
        {step < 3 && <Progress step={step} total={3} />}

        {step===0 && <Step1 data={form} set={set} onNext={()=>setStep(1)} />}
        {step===1 && <Step2 data={form} set={set} onNext={generate} onBack={()=>setStep(0)} />}
        {step===3 && <Loader />}
        {step===4 && plan && <WeeklyPlan plan={plan} data={form} onReset={()=>{ setStep(0); setForm(EMPTY_FORM); setPlan(null); }} />}
        {step===5 && <ErrorView msg={errMsg} onRetry={()=>setStep(1)} />}
      </div>
    </div>
  );
}
