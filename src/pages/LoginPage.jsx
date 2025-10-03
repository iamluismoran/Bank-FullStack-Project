import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/feedback/Alert";
import "../styles/pages/AuthPage.css";

export default function LoginPage() {
  const { signIn } = useAuth();
  const [sp] = useSearchParams();
  const redirect = sp.get("redirect") || "/accounts";

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
    if (error) setError(error.message || "Invalid credentials");
    else navigate(redirect, { replace: true });
  }

  return (
    <div className="container">
      <div className="card auth-card">
        <h1 className="title">Login</h1>
        {error && <Alert>{error}</Alert>}
        <form onSubmit={onSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button disabled={busy} type="submit">{busy ? "Signing in..." : "Sign in"}</button>
        </form>

        <p className="hint">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}