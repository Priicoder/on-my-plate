import "../../styles/Progress.css";

export default function Progress({ step, total }) {
  return (
    <div className="progress">
      {Array.from({ length: total }).map((_, i) => {
        const state = i < step ? "done" : i === step ? "current" : "";
        return (
          <div key={i} className={`progress__bar${state ? ` progress__bar--${state}` : ""}`} />
        );
      })}
      <span className="progress__count">
        {step + 1} / {total}
      </span>
    </div>
  );
}
