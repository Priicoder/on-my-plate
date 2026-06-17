import "../../styles/NavButtons.css";

export default function NavButtons({ onBack, onNext, nextLabel="Continue →", disabled }) {
  return (
    <div className={`nav-buttons${onBack ? " nav-buttons--with-back" : ""}`}>
      {onBack && (
        <button onClick={onBack} className="nav-back">← Back</button>
      )}
      <button onClick={onNext} disabled={disabled} className="nav-next">{nextLabel}</button>
    </div>
  );
}
