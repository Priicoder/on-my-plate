import { INK, MUTED } from "../../constants/theme";

export default function SLabel({ children, note }) {
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ fontSize:15, fontWeight:500, color:INK, marginBottom:note?3:0 }}>{children}</div>
      {note && <div style={{ fontSize:13, color:MUTED }}>{note}</div>}
    </div>
  );
}
