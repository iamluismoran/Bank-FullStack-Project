import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAccount, getAccountBalance } from "../api/accounts";
import Spinner from "../components/feedback/Spinner";
import Alert from "../components/feedback/Alert";
import "../styles/pages/AccountDetailPage.css";

export default function AccountDetailPage() {
  const { id } = useParams();

  // Detalle
  const [account, setAccount] = useState(null);
  const [loadingAcc, setLoadingAcc] = useState(true);
  const [accError, setAccError] = useState("");

  // Saldo
  const [balance, setBalance] = useState(null);
  const [loadingBal, setLoadingBal] = useState(false);
  const [balError, setBalError] = useState("");

  // Cargar detalle
  useEffect(() => {
    let cancel = false;
    async function loadDetail() {
      setAccError("");
      setLoadingAcc(true);
      try {
        const data = await getAccount(id);
        if (!cancel) setAccount(data);
      } catch (e) {
        if (!cancel) setAccError(e?.message || "No se pudo cargar la cuenta");
      } finally {
        if (!cancel) setLoadingAcc(false);
      }
    }
    loadDetail();
    return () => { cancel = true; };
  }, [id]);

  // Cargar saldo
  useEffect(() => {
    refreshBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function refreshBalance() {
    setBalError("");
    setLoadingBal(true);
    try {
      const data = await getAccountBalance(id);
      setBalance(typeof data === "number" ? data : (data?.balance ?? 0));
    } catch (e) {
      setBalError(e?.message || "No se pudo obtener el saldo");
    } finally {
      setLoadingBal(false);
    }
  }

  if (loadingAcc) {
    return (
      <div className="container account-detail">
        <Spinner label="Cargando cuenta..." />
      </div>
    );
  }
  if (accError) {
    return (
      <div className="container account-detail">
        <Alert>{accError}</Alert>
      </div>
    );
  }
  if (!account) return null;

  const {
    type, status, creationDate,
    primaryOwnerName, primaryOwnerId,
    hasSecondaryOwner, secondaryOwnerId
  } = account;

  const formattedBalance =
    Number(balance ?? 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="container account-detail">
      {/* Header */}
      <div className="card detail-header">
        <div>
          <h1 className="title">Cuenta Nº{account.id}</h1>
          <p>
            <strong>Titular:</strong> {primaryOwnerName} ({primaryOwnerId})<br />
            <strong>Secundario:</strong> {hasSecondaryOwner ? secondaryOwnerId : "—"}
          </p>
          <p><Link to="/accounts">← Volver al listado</Link></p>
        </div>
        <div className="detail-tags">
          <span className="badge">{type}</span>
          <span className="badge">{status}</span>
        </div>
      </div>

      {/* Saldo actual */}
      <div className="card">
        <div className="balance-row">
          <h2 className="section-title">Saldo actual</h2>
          <button type="button" onClick={refreshBalance} disabled={loadingBal}>
            {loadingBal ? "Actualizando..." : "Actualizar saldo"}
          </button>
        </div>

        {balError ? (
          <Alert>{balError}</Alert>
        ) : (
          <div className="balance-amount lg">
            {loadingBal ? "—" : formattedBalance}
          </div>
        )}
      </div>
      <div className="two-col">
        <div className="card">
          <h2 className="section-title">Información</h2>
          <div className="kv">
            <div><span className="k">Tipo</span><span className="v">{type}</span></div>
            <div><span className="k">Estado</span><span className="v">{status}</span></div>
            <div><span className="k">Creación</span><span className="v">{creationDate}</span></div>
          </div>
        </div>

        {account.checking && (
          <div className="card">
            <h2 className="section-title">Checking</h2>
            <div className="kv">
              <div><span className="k">Saldo mínimo</span><span className="v">{Number(account.checking.minimumBalance).toLocaleString()}</span></div>
              <div><span className="k">Cuota mensual</span><span className="v">{Number(account.checking.monthlyMaintenanceFee).toLocaleString()}</span></div>
              <div><span className="k">Últ. comisión</span><span className="v">—</span></div>
            </div>
          </div>
        )}

        {account.savings && (
          <div className="card">
            <h2 className="section-title">Savings</h2>
            <div className="kv">
              <div><span className="k">Interés anual</span><span className="v">
                {Number(account.savings.interestRate).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 2 })}
              </span></div>
              <div><span className="k">Mínimo</span><span className="v">{Number(account.savings.minimumBalance).toLocaleString()}</span></div>
            </div>
          </div>
        )}

        {account.creditCard && (
          <div className="card">
            <h2 className="section-title">Credit Card</h2>
            <div className="kv">
              <div><span className="k">Límite</span><span className="v">{Number(account.creditCard.creditLimit).toLocaleString()}</span></div>
              <div><span className="k">Interés anual</span><span className="v">
                {Number(account.creditCard.interestRate).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 2 })}
              </span></div>
              <div><span className="k">Últ. interés</span><span className="v">—</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
