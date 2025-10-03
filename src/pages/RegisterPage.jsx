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
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    const { data, error } = await signUp({ email, password });
    setBusy(false);
    if (error) {
      setError(error.message || "Could not register");
      return;
    }
    if (data?.session) {
      navigate("/accounts", { replace: true });
    } else {
      setMsg("Check your email to confirm your account, then log in.");
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
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

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
