import "../../styles/Pill.css";

export default function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`pill${active ? " pill--active" : ""}`}
    >
      {children}
    </button>
  );
}
