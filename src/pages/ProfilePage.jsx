import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useDemoProfile } from "../context/ProfileContext";
import Alert from "../components/feedback/Alert";
import "../styles/pages/ProfilePage.css";

export default function ProfilePage() {
  const { user, updateUserMetadata } = useAuth(); 
  const { ownerId, setOwnerId, showMineOnly, setShowMineOnly } = useDemoProfile();

  const [inputOwner, setInputOwner] = useState(ownerId ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [supabaseSaved, setSupabaseSaved] = useState(false);

  function saveLocal() {
    setSaved(false);
    setSupabaseSaved(false);
    setError("");
    const id = Number(inputOwner);
    if (!Number.isInteger(id) || id <= 0) {
      setError("Owner ID must be a positive integer.");
      return;
    }
    setOwnerId(id);
    setSaved(true);
  }

  async function saveToSupabase() {
    setSaved(false);
    setSupabaseSaved(false);
    setError("");
    const id = Number(inputOwner);
    if (!Number.isInteger(id) || id <= 0) {
      setError("Owner ID must be a positive integer.");
      return;
    }
    const { error } = await updateUserMetadata({ ownerId: id });
    if (error) {
      setError(error.message || "Could not update metadata");
    } else {
      setSupabaseSaved(true);
      // por UX, activamos el filtro de "mis cuentas"
      setOwnerId(id);
      setShowMineOnly(true);
    }
  }

  function quickSet(id) {
    setInputOwner(String(id));
    setOwnerId(id);
    setSaved(true);
    setSupabaseSaved(false);
    setError("");
  }

  return (
    <div className="container">
      <div className="card profile-card">
        <h1 className="title">My Profile</h1>
        <p className="muted">Signed in as <strong>{user?.email}</strong></p>

        {error && <Alert>{error}</Alert>}
        {saved && <div className="card" role="status" aria-live="polite">Preferences saved locally.</div>}
        {supabaseSaved && <div className="card" role="status" aria-live="polite">Saved to Supabase user metadata.</div>}

        <div className="grid-2">
          <div>
            <label htmlFor="ownerId">Demo Owner ID</label>
            <input
              id="ownerId"
              type="number"
              min="1"
              step="1"
              value={inputOwner}
              onChange={(e) => setInputOwner(e.target.value)}
              placeholder="e.g. 1"
            />
            <p className="hint">Set which AccountHolder ID is “yours” (1=Felipe, 2=Sofía, 3=Eve).</p>
            <div className="row gap-8">
              <button type="button" onClick={() => quickSet(1)}>Use 1 (Felipe)</button>
              <button type="button" onClick={() => quickSet(2)}>Use 2 (Sofía)</button>
              <button type="button" onClick={() => quickSet(3)}>Use 3 (Eve)</button>
            </div>
          </div>

          <div>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={showMineOnly}
                onChange={(e) => setShowMineOnly(e.target.checked)}
              />
              <span>Show only my accounts (client-side)</span>
            </label>
            <p className="hint">When enabled, lists will filter by your Owner ID locally.</p>
          </div>
        </div>

        <div className="actions">
          <button onClick={saveLocal}>Save locally</button>
          <button type="button" onClick={saveToSupabase}>Save to Supabase</button>
        </div>
      </div>
    </div>
  );
}
