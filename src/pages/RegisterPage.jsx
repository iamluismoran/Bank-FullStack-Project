import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/feedback/Alert";
import "../styles/pages/AuthPage.css";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setMsg("");

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setBusy(true);
    const { data, error } = await signUp({ email, password });
    setBusy(false);

    if (error) {
      setError(error.message || "No se pudo registrar");
      return;
    }

    // Como está desactivada la confirmación de email, habrá sesión directa
    if (data?.session) {
      navigate("/dashboard", { replace: true });
    } else {
      setMsg("Revisa tu correo para confirmar la cuenta y luego inicia sesión.");
    }
  }

  return (
    <div className="container">
      <div className="card auth-card">
        <h1 className="title">Register</h1>
        {error && <Alert>{error}</Alert>}
        {msg && <div className="card" role="status" aria-live="polite">{msg}</div>}

        <form onSubmit={onSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="new-password"
            value={password} onChange={(e) => setPassword(e.target.value)} required />

          <label htmlFor="confirm">Confirm password</label>
          <input id="confirm" type="password" autoComplete="new-password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)} required />

          <button disabled={busy} type="submit">{busy ? "Creando..." : "Create account"}</button>
        </form>

        <p className="hint">
          ¿Ya tienes cuenta? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}