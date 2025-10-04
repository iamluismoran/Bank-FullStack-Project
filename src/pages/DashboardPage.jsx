import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDemoProfile } from "../context/ProfileContext";
import { useAccountsList } from "../hooks/useAccounts";
import { getAccountBalance } from "../api/accounts";
import Spinner from "../components/feedback/Spinner";
import Alert from "../components/feedback/Alert";
import "../styles/pages/DashboardPage.css";

export default function DashboardPage() {
  const { user } = useAuth();
  const { ownerId } = useDemoProfile();
  const navigate = useNavigate();

  // Traemos varias cuentas y filtramos por owner
  const { data, isLoading, isError, error } = useAccountsList("", 1, 50);

  const myAccounts = useMemo(() => {
    const items = data?.items || [];
    return ownerId ? items.filter(a => a.primaryOwnerId === ownerId) : items;
  }, [data, ownerId]);

  // Elegimos "principal": prioriza CHECKING
  const main = useMemo(() => {
    if (!myAccounts.length) return null;
    const checking = myAccounts.find(a => a.type === "CHECKING");
    return checking || myAccounts[0];
  }, [myAccounts]);

  // Estado para el balance (en lugar de pedir el detalle completo)
  const [balance, setBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState("");

  useEffect(() => {
    let cancel = false;
    async function load() {
      setBalanceError("");
      setBalance(null);
      if (!main) return;
      setLoadingBalance(true);
      try {
        const b = await getAccountBalance(main.id);
        if (!cancel) setBalance(b);
      } catch (e) {
        if (!cancel) setBalanceError(e?.message || "No se pudo cargar el balance");
      } finally {
        if (!cancel) setLoadingBalance(false);
      }
    }
    load();
    return () => { cancel = true; };
  }, [main]);

  return (
    <div className="container dashboard">
      <div className="card dashboard-hero">
        <div>
          <h1 className="title">Bienvenido, Felipe Boyle</h1>
          <p className="muted">Principales productos</p>
        </div>
        {!!main && (
          <div className="hero-actions">
            <button onClick={() => navigate(`/accounts/${main.id}`)}>Ver detalle</button>
            <button onClick={() => navigate(`/accounts/${main.id}`)} aria-label="Transferir">Transferir</button>
          </div>
        )}
      </div>

      <div className="grid-2">
        {/* Cuenta principal */}
        <div className="card">
          <h2 className="section-title">Cuenta principal</h2>

          {!main && <Alert>No tienes cuentas asociadas</Alert>}
          {main && (
            <>
              <div className="kv">
                <div><span className="k">ID</span><span className="v">Nº {main.id}</span></div>
                <div><span className="k">Tipo</span><span className="v">{main.type}</span></div>
                <div><span className="k">Estado</span><span className="v">{main.status}</span></div>
                <div><span className="k">Creación</span><span className="v">{main.creationDate}</span></div>
              </div>

              {loadingBalance && <Spinner label="Cargando balance..." />}
              {balanceError && <Alert>{balanceError}</Alert>}
              {balance != null && (
                <div className="balance-card">
                  <div className="balance-label">Saldo actual</div>
                  <div className="balance-amount">
                    {Number(balance).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="balance-sub">Titular: {main.primaryOwnerName}</div>
                </div>
              )}

              <div className="row gap-8">
                <Link to={`/accounts/${main.id}`}><button>Ver movimientos</button></Link>
                <Link to={`/accounts/${main.id}`}><button>Transferir</button></Link>
              </div>
            </>
          )}
        </div>

        {/* Mis cuentas */}
        <div className="card">
          <h2 className="section-title">Mis cuentas</h2>

          {isLoading && <Spinner />}
          {isError && <Alert>{error?.message || "No se pudo cargar"}</Alert>}

          {(!isLoading && !isError && myAccounts.length === 0) && (
            <Alert>No tienes cuentas.</Alert>
          )}

          {myAccounts.length > 0 && (
            <div className="table-wrap">
              <table className="table" role="table" aria-label="Mis cuentas">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {myAccounts.map(a => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.type}</td>
                      <td>{a.status}</td>
                      <td><Link to={`/accounts/${a.id}`}>Ver</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}