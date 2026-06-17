import "../../styles/ErrorView.css";

export default function ErrorView({ msg, onRetry }) {
  return (
    <div className="error">
      <div className="error__icon">🌾</div>
      <p className="error__title">Something went wrong</p>
      <p className="error__msg">{msg}</p>
      <button onClick={onRetry} className="error__btn">Try again</button>
    </div>
  );
}
