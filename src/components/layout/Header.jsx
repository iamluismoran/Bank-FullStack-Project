import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/components/layout/Header.css";

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
        <div className="header__bar">
          <div className="brand">
            <NavLink to="/" className="brand__link">REGALBANK</NavLink>
          </div>

          <nav className="nav">
            {!user ? (
              <>
                <NavLink to="/login">Iniciar sesión</NavLink>
                <NavLink to="/register">Crear cuenta</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/accounts">Cuentas</NavLink>
                <NavLink to="/dashboard">Perfil</NavLink>
                <span className="badge">{user.email}</span>
                <button type="button" onClick={handleLogout}>Salir</button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}