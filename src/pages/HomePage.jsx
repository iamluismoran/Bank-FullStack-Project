// src/pages/HomePage.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/HomePage.css";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="container">
      {/* Hero */}
      <section className="card hero">
        <h1 className="hero__title">Banco Demo</h1>
        <p className="hero__subtitle">
          Gestiona cuentas, consulta saldos en vivo, crea productos y prueba reglas de negocio,
          todo con un backend real (Spring Boot) y un frontend React.
        </p>

        <div className="hero__actions">
          {!user ? (
            <>
              <Link to="/login"><button>Login</button></Link>
              <Link to="/register"><button className="ghost">Register</button></Link>
              <Link to="/accounts"><button className="ghost">Ver cuentas</button></Link>
            </>
          ) : (
            <>
              <Link to="/accounts"><button>Ir a mis cuentas</button></Link>
              <Link to="/accounts/new"><button className="ghost">Crear cuenta</button></Link>
            </>
          )}
        </div>
      </section>
      
      <section className="grid-features">
        <div className="card feature">
          <h2 className="feature__title">Backend real</h2>
          <p className="feature__text">
            API en Spring Boot (GET/POST/PUT/PATCH/DELETE) y DB viva.
          </p>
        </div>

        <div className="card feature">
          <h2 className="feature__title">Saldos en vivo</h2>
          <p className="feature__text">
            Actualiza saldos aplicando intereses/penalizaciones desde el backend.
          </p>
        </div>

        <div className="card feature">
          <h2 className="feature__title">Rutas protegidas</h2>
          <p className="feature__text">
            Login/Register con Supabase; creación/edición solo para usuarios autenticados.
          </p>
        </div>
      </section>
    </div>
  );
}
