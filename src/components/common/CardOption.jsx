import { useState } from "react";
import { SAGE, SAGE_L, MIST, BORDER, INK, MUTED } from "../../constants/theme";

export default function CardOption({ active, onClick, emoji, label, sub }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "16px 14px",
        borderRadius: 14,
        border: active ? `2px solid ${SAGE}` : `1.5px solid ${BORDER}`,
        background: active ? SAGE_L : hover ? MIST : "#fff",
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.15s",
        transform: hover && !active ? "translateY(-2px)" : "none",
        boxShadow: active ? `0 0 0 3px ${SAGE}22` : hover ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
        outline: "none",
      }}
    >
      <div style={{ fontSize:22, marginBottom:5 }}>{emoji}</div>
      <div style={{ fontSize:13, fontWeight:500, color: active ? SAGE : INK, marginBottom:sub?3:0 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:MUTED }}>{sub}</div>}
    </button>
  );
}
