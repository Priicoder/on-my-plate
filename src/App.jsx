import { useState } from "react";
import { CREAM, SAGE, BORDER, MUTED } from "./constants/theme";
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
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:4000,
          messages:[{ role:"user", content: buildPrompt(form) }],
        }),
      });
      if (!res.ok) {
        const errBody = await res.text().catch(()=>"");
        throw new Error(`API error ${res.status}${errBody? ": "+errBody.slice(0,120):""}`);
      }
      const data = await res.json();
      const raw = data.content.map(b=>b.text||"").join("").trim();
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
    <div style={{ background:CREAM, minHeight:"100vh", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* Top bar */}
      <div style={{ borderBottom:`1px solid ${BORDER}`, background:"#fff", padding:"0 20px" }}>
        <div style={{ maxWidth:680, margin:"0 auto", padding:"14px 0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:22 }}>🌿</span>
            <div>
              <div style={{ fontSize:16, fontWeight:600, color:SAGE, letterSpacing:"-0.3px" }}>On My Plate</div>
              <div style={{ fontSize:11, color:MUTED, marginTop:-1 }}>personalised plant-based nutrition</div>
            </div>
          </div>
          {step < 3 && <span style={{ fontSize:12, color:MUTED }}>Free · No sign-up · Private</span>}
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth:680, margin:"0 auto", padding:"28px 20px 60px" }}>
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
