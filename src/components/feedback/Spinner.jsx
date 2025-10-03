import "../../styles/components/feedback/Spinner.css";

export default function Spinner({ label = "Cargando..." }) {
  return (
    <div className="card spinner" role="status" aria-live="polite">
      {label}
    </div>
  );
}
