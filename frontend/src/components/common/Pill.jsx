import { useState } from "react";
import { btn, SAGE_L, MIST } from "../../constants/theme";

export default function Pill({ active, onClick, children }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...btn(active),
        background: active ? SAGE_L : hover ? MIST : "#fff",
        transform: hover && !active ? "translateY(-1px)" : "none",
        boxShadow: active ? `0 0 0 0px transparent` : hover ? "0 2px 8px rgba(0,0,0,0.07)" : "none",
      }}
    >
      {children}
    </button>
  );
}
