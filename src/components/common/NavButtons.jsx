import { SAGE, MIST, MUTED, BORDER } from "../../constants/theme";

export default function NavButtons({ onBack, onNext, nextLabel="Continue →", disabled }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns: onBack?"1fr 2fr":"1fr", gap:10, marginTop:28 }}>
      {onBack && (
        <button onClick={onBack} style={{
          padding:"14px", borderRadius:10, background:"transparent",
          border:`1.5px solid ${BORDER}`, cursor:"pointer", fontSize:14, color:MUTED,
        }}>← Back</button>
      )}
      <button onClick={onNext} disabled={disabled} style={{
        padding:"14px", borderRadius:10, cursor: disabled ? "not-allowed":"pointer",
        background: disabled ? MIST : SAGE,
        color: disabled ? MUTED : "#fff",
        border: "none", fontSize:15, fontWeight:500,
        transition:"all 0.15s",
        boxShadow: disabled ? "none" : `0 4px 14px ${SAGE}44`,
      }}>{nextLabel}</button>
    </div>
  );
}
