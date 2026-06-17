import { useState } from "react";
import "../../styles/Loader.css";

export default function Loader() {
  const msgs = ["Consulting your nutritional needs…","Picking seasonal ingredients…","Building your 7-day plan…","Adding the finishing garnish…"];
  const [idx, setIdx] = useState(0);
  useState(()=>{ const t=setInterval(()=>setIdx(i=>(i+1)%msgs.length),1800); return()=>clearInterval(t); });
  return (
    <div className="loader">
      <div className="loader__icon">🌿</div>
      <p className="loader__msg">{msgs[idx]}</p>
      <p className="loader__sub">Crafting your personalised weekly plan…</p>
    </div>
  );
}
