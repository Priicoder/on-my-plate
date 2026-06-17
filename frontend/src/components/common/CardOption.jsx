import "../../styles/CardOption.css";

export default function CardOption({ active, onClick, emoji, label, sub }) {
  return (
    <button
      onClick={onClick}
      className={`card-option${active ? " card-option--active" : ""}`}
    >
      <div className="card-option__emoji">{emoji}</div>
      <div className={`card-option__label${sub ? " card-option__label--with-sub" : ""}`}>{label}</div>
      {sub && <div className="card-option__sub">{sub}</div>}
    </button>
  );
}
