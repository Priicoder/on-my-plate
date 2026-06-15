import { useState } from "react";
import { SAGE, MUTED } from "../../constants/theme";

export default function Loader() {
  const msgs = ["Consulting your nutritional needs…","Picking seasonal ingredients…","Building your 7-day plan…","Adding the finishing garnish…"];
  const [idx, setIdx] = useState(0);
  useState(()=>{ const t=setInterval(()=>setIdx(i=>(i+1)%msgs.length),1800); return()=>clearInterval(t); });
  return (
    <div style={{ textAlign:"center", padding:"60px 20px" }}>
      <div style={{ fontSize:40, marginBottom:20, animation:"spin 2s linear infinite" }}>🌿</div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <p style={{ fontSize:16, color:SAGE, fontWeight:500 }}>{msgs[idx]}</p>
      <p style={{ fontSize:13, color:MUTED, marginTop:8 }}>Crafting your personalised weekly plan…</p>
    </div>
  );
}
