import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { transfer } from "../api/accounts";
import { useDemoProfile } from "../context/ProfileContext";
import Alert from "../components/feedback/Alert";
import Modal from "../components/feedback/Modal";
import "../styles/pages/TransferPage.css";

export default function TransferPage() {
  const { id } = useParams(); // ID origen
  const navigate = useNavigate();
  const { ownerId } = useDemoProfile();

  // ID origen visible y bloqueado
  const [fromId] = useState(Number(id) || 0);

  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Modal de éxito
  const [openSuccess, setOpenSuccess] = useState(false);

  useEffect(() => {
    setError("");
  }, [toId, amount]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const toAccountId = Number(toId);
    const amt = Number(amount);

    if (!fromId || !toAccountId || !amt || amt <= 0) {
      setError("Completa todos los campos con valores válidos.");
      return;
    }
    if (!ownerId) {
      setError("No se encontró tu Owner ID (perfil).");
      return;
    }

    setBusy(true);
    try {
      await transfer({
        fromAccountId: fromId,
        toAccountId,
        amount: amt,
        requestOwnerId: ownerId,
      });
      setOpenSuccess(true);
    } catch (e2) {
      setError(e2?.message || "No se pudo realizar la transferencia");
    } finally {
      setBusy(false);
    }
  }

  function closeAndGoBack() {
    setOpenSuccess(false);
    navigate(`/accounts/${fromId}`, { replace: true });
  }

  return (
    <div className="container">
      <div className="card transfer-header">
        <div>
          <h1 className="title">Transferir desde cuenta Nº{fromId}</h1>
          <p><Link to={`/accounts/${fromId}`}>← Volver al detalle</Link></p>
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">Nueva transferencia</h2>

        {error && <Alert>{error}</Alert>}

        <form onSubmit={onSubmit} className="transfer-form">
          <div className="form-row">
            <label htmlFor="fromId">De la cuenta (ID origen)</label>
            <input
              id="fromId"
              type="number"
              value={fromId}
              readOnly
              aria-readonly="true"
            />
          </div>

          <div className="form-row">
            <label htmlFor="toId">A la cuenta (ID destino)</label>
            <input
              id="toId"
              type="number"
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              required
              inputMode="numeric"
            />
          </div>

          <div className="form-row">
            <label htmlFor="amount">Monto</label>
            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              inputMode="decimal"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={busy}>
              {busy ? "Enviando..." : "Confirmar transferencia"}
            </button>
            <Link to={`/accounts/${fromId}`}>
              <button type="button">Cancelar</button>
            </Link>
          </div>
        </form>
      </div>

      {/* Modal de éxito */}
      <Modal
        open={openSuccess}
        title="¡Transferencia realizada con éxito!"
        onClose={closeAndGoBack}
        actions={<button type="button" onClick={closeAndGoBack}>Aceptar</button>}
      >
        Tu operación fue procesada correctamente.
      </Modal>
    </div>
  );
}