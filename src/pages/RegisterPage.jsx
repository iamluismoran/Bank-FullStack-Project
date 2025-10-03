import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/feedback/Alert";
import "../styles/pages/AuthPage.css";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isPositiveInt = (v) => /^-?\d+$/.test(String(v).trim()) && Number(v) > 0;

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setMsg("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (!isPositiveInt(ownerId)) {
      setError("Owner ID must be a positive integer (e.g., 1 for Felipe).");
      return;
    }

    setBusy(true);
    const { data, error } = await signUp({
      email,
      password,
      // Guarda el ownerId en user_metadata de Supabase
      options: { data: { ownerId: Number(ownerId) } },
    });
    setBusy(false);

    if (error) {
      setError(error.message || "Could not register");
      return;
    }
    // Como la confirmación de email está desactivada, habrá sesión directa
    if (data?.session) navigate("/accounts", { replace: true });
    else setMsg("Check your email to confirm your account, then log in.");
  }

  return (
    <div className="container">
      <div className="card auth-card">
        <h1 className="title">Register</h1>
        {error && <Alert>{error}</Alert>}
        {msg && <div className="card" role="status" aria-live="polite">{msg}</div>}

        <form onSubmit={onSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label htmlFor="ownerId">Owner ID (e.g., 1 = Felipe)</label>
          <input id="ownerId" type="number" min="1" step="1" value={ownerId} onChange={(e) => setOwnerId(e.target.value)} required />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <label htmlFor="confirm">Confirm password</label>
          <input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />

          <button disabled={busy} type="submit">{busy ? "Creating..." : "Create account"}</button>
        </form>

        <p className="hint">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
