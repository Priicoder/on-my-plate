import "../../styles/SLabel.css";

export default function SLabel({ children, note }) {
  return (
    <div className="s-label">
      <div className={`s-label__text${note ? " s-label__text--with-note" : ""}`}>{children}</div>
      {note && <div className="s-label__note">{note}</div>}
    </div>
  );
}
