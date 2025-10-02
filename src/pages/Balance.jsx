import { useState } from "react";
import { get } from "../api/client";

export default function BalancePage() {
  const [id, setId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); setResult(null); setLoading(true);
    try {
      const data = await get(`/api/accounts/${id}/balance`);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Check balance</h2>
      <form onSubmit={onSubmit} className="form">
        <label>Account ID
          <input value={id} onChange={e=>setId(e.target.value)} required/>
        </label>
        <button type="submit" disabled={loading}>Get Balance</button>
      </form>
      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {result && <pre className="result">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
