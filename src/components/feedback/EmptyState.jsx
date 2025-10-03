export default function EmptyState({ children = "Sin resultados" }) {
  return (
    <div className="card" style={{ color: "var(--muted)" }}>
      {children}
    </div>
  );
}
