import { SAGE, INK, MUTED } from "../../constants/theme";

export default function ErrorView({ msg, onRetry }) {
  return (
    <div style={{ textAlign:"center", padding:"40px 20px" }}>
      <div style={{ fontSize:36, marginBottom:12 }}>🌾</div>
      <p style={{ fontSize:16, fontWeight:500, color:INK, marginBottom:8 }}>Something went wrong</p>
      <p style={{ fontSize:13, color:MUTED, marginBottom:20 }}>{msg}</p>
      <button onClick={onRetry} style={{ padding:"12px 28px", borderRadius:10, background:SAGE, color:"#fff", border:"none", cursor:"pointer", fontSize:14 }}>Try again</button>
    </div>
  );
}
