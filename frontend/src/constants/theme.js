// ── Brand tokens ──────────────────────────────────────────────────────────────
export const SAGE   = "#4A7C59";
export const SAGE_L = "#EAF3EC";
export const SAGE_M = "#B8D9BF";
export const CLAY   = "#C96B3A";
export const CLAY_L = "#FBF0EA";
export const CREAM  = "#FDFAF6";
export const INK    = "#1C1C1C";
export const MIST   = "#F2EFE9";
export const MUTED  = "#7A7670";
export const BORDER = "rgba(74,124,89,0.18)";

export const btn = (active) => ({
  padding: "10px 16px",
  borderRadius: 40,
  border: active ? `2px solid ${SAGE}` : `1.5px solid ${BORDER}`,
  background: active ? SAGE_L : "#fff",
  color: active ? SAGE : INK,
  fontWeight: active ? 500 : 400,
  fontSize: 14,
  cursor: "pointer",
  transition: "all 0.15s ease",
  outline: "none",
  userSelect: "none",
});

export const card = {
  background: "#fff",
  borderRadius: 16,
  border: `1px solid ${BORDER}`,
  padding: "20px 22px",
  marginBottom: 20,
};
