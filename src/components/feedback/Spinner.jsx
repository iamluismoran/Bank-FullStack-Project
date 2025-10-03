export default function Spinner({ label = "Cargando..." }) {
  return (
    <div className="card" role="status" aria-live="polite">
      {label}
    </div>
  );
}
