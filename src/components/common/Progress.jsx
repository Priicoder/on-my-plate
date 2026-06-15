import { SAGE, SAGE_M, MIST, MUTED } from "../../constants/theme";

export default function Progress({ step, total }) {
  return (
    <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:28 }}>
      {Array.from({length:total}).map((_,i) => (
        <div key={i} style={{
          height: 4, flex: 1, borderRadius: 4,
          background: i < step ? SAGE : i === step ? SAGE_M : MIST,
          transition: "background 0.3s",
        }} />
      ))}
      <span style={{ fontSize:12, color:MUTED, whiteSpace:"nowrap", marginLeft:6 }}>
        {step+1} / {total}
      </span>
    </div>
  );
}
