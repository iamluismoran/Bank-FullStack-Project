// src/components/layout/Header.jsx
import { NavLink, useNavigate } from "react-router-dom";
import useHealth from "../../hooks/useHealth";
import { useAuth } from "../../context/AuthContext";
import "../../styles/components/layout/Header.css";

function HealthBadge() {
  const { data, isFetching, refetch } = useHealth();
  const ok = data?.status === "UP" && data?.db === "UP";

  return (
    <button
      type="button"
      className={`badge ${ok ? "success" : "danger"} health-btn`}
      onClick={() => refetch()}
      aria-busy={isFetching}
      aria-live="polite"
      title="Probar conexión"
    >
      {ok ? "Conexión abierta" : "Sin conexión"}
    </button>
  );
}

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <header className="header">
      <div className="container">
        <div className="card header__bar">
          <div className="brand">Banco Demo</div>

          <nav className="nav">
            <NavLink to="/accounts">Cuentas</NavLink>

            {!user ? (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            ) : (
              <>
                <span className="badge">{user.email}</span>
                <button type="button" onClick={handleLogout}>Logout</button>
              </>
            )}

            <HealthBadge />
          </nav>
        </div>
      </div>
    </header>
  );
}