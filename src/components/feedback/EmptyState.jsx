import "../../styles/components/feedback/EmptyState.css";

export default function EmptyState({ children = "Sin resultados" }) {
  return (
    <div className="card empty-state">
      {children}
    </div>
  );
}
