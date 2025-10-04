import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/feedback/Alert";
import "../styles/pages/AuthPage.css";

export default function LoginPage() {
  const { signIn } = useAuth();
  const [sp] = useSearchParams();
  const redirect = sp.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error } = await signIn({ email, password });
    setBusy(false);
    if (error) setError(error.message || "Credenciales inválidas");
    else navigate(redirect, { replace: true });
  }

  return (
    <div className="auth">
      <div className="container">
        <div className="card auth-card">
          <h1 className="auth-title">Iniciar sesión</h1>

          {error && <Alert>{error}</Alert>}

          <form className="auth-form" onSubmit={onSubmit}>
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="btn-primary" disabled={busy} type="submit">
              {busy ? "Entrando..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="auth-footer">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}