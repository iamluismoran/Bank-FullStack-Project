export default function Alert({ children }) {
  return (
    <div className="card" role="alert" style={{ borderColor: "#5e1f2a", color: "#ff9aa2" }}>
      {children}
    </div>
  );
}
