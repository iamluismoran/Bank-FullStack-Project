import { NavLink } from "react-router-dom";
import useHealth from "../../hooks/useHealth";
import "../../styles/components/layout/Header.css";

function HealthBadge() {
  const { data, isLoading, isError, refetch, isFetching } = useHealth();
  const up = data?.status === "UP" && data?.db === "UP";

  let label = "Comprobar conexión";
  if (isLoading || isFetching) label = "Comprobando...";
  else if (isError) label = "Sin conexión";
  else if (up) label = "Conexión abierta";
  else if (data) label = "Sin conexión";

  const cls = `badge ${up ? "ok" : isError ? "err" : ""}`;

  return (
    <button
      className="health-btn"
      onClick={() => refetch()}
      aria-live="polite"
      aria-busy={isFetching || isLoading}
      title="Probar conexión con el backend"
    >
      <span className={cls}>{label}</span>
    </button>
  );
}

export default function Header() {
  return (
    <header className="container header">
      <div className="card row header__bar">
        <div className="brand">Banco Demo</div>
        <nav className="nav">
          <NavLink to="/accounts">Cuentas</NavLink>
          <NavLink to="/login">Login</NavLink>
          <HealthBadge />
        </nav>
      </div>
    </header>
  );
}