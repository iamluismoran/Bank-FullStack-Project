import { useParams, Link } from "react-router-dom";
import { useAccountDetail, useAccountBalance } from "../hooks/useAccounts";
import Spinner from "../components/feedback/Spinner";
import Alert from "../components/feedback/Alert";
import Badge from "../components/ui/Badge";

import "../styles/pages/AccountDetailPage.css";

export default function AccountDetailPage() {
  const { id } = useParams();

  const detailQ = useAccountDetail(id);
  const balanceQ = useAccountBalance(id);

  if (detailQ.isLoading) return <div className="container"><Spinner label="Cargando detalle..." /></div>;
  if (detailQ.isError) return <div className="container"><Alert>Error: {detailQ.error?.message || "No se pudo cargar el detalle"}</Alert></div>;

  const data = detailQ.data;

  const tags = Array.isArray(data?.tags) ? data.tags : [data?.type, data?.status].filter(Boolean);

  return (
    <div className="container">
      {}
      <div className="card detail-header">
        <div className="detail-title">
          <h1 className="title">Cuenta #{data.id}</h1>
          <div className="tags">
            {tags.map((t, i) => (
              <Badge key={i}>{t}</Badge>
            ))}
          </div>
        </div>
        <div className="row detail-sub">
          <div><strong>Titular:</strong> {data.primaryOwnerName} (ID {data.primaryOwnerId})</div>
          {data.hasSecondaryOwner && <div><strong>Secundario:</strong> {data.secondaryOwnerId}</div>}
          <div className="spacer" />
          <Link to="/accounts">← Volver al listado</Link>
        </div>
      </div>

      {}
      <div className="card balance-card" aria-live="polite" aria-busy={balanceQ.isFetching}>
        <div className="balance-row">
          <div>
            <div className="balance-label">Saldo actual</div>
            <div className="balance-display">
              {balanceQ.isLoading ? "Cargando..." :
               balanceQ.isError ? "—" :
               (typeof balanceQ.data?.balance === "number"
                  ? balanceQ.data.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : balanceQ.data?.balance ?? "—")}
            </div>
          </div>
          <div className="row gap-8">
            <button onClick={() => balanceQ.refetch()} disabled={balanceQ.isFetching}>Actualizar saldo</button>
          </div>
        </div>
        {balanceQ.isError && <div className="balance-error">No se pudo cargar el saldo.</div>}
      </div>

      {}
      <div className="detail-grid">
        <div className="card">
          <h2 className="section-title">Información</h2>
          <dl className="meta">
            <div><dt>Tipo</dt><dd>{data.type}</dd></div>
            <div><dt>Estado</dt><dd>{data.status}</dd></div>
            <div><dt>Creación</dt><dd>{data.creationDate}</dd></div>
          </dl>
        </div>

        {}
        {data.checking && (
          <div className="card">
            <h2 className="section-title">Checking</h2>
            <dl className="meta">
              <div><dt>Saldo mínimo</dt><dd>{fmtMoney(data.checking.minimumBalance)}</dd></div>
              <div><dt>Cuota mensual</dt><dd>{fmtMoney(data.checking.monthlyMaintenanceFee)}</dd></div>
              <div><dt>Últ. comisión</dt><dd>{data.checking.lastMonthlyFeeDate || "—"}</dd></div>
            </dl>
          </div>
        )}

        {data.savings && (
          <div className="card">
            <h2 className="section-title">Savings</h2>
            <dl className="meta">
              <div><dt>Saldo mínimo</dt><dd>{fmtMoney(data.savings.minimumBalance)}</dd></div>
              <div><dt>Interés anual</dt><dd>{fmtRate(data.savings.interestRate)}</dd></div>
              <div><dt>Últ. interés</dt><dd>{data.savings.lastInterestDate || "—"}</dd></div>
            </dl>
          </div>
        )}

        {data.creditCard && (
          <div className="card">
            <h2 className="section-title">Credit Card</h2>
            <dl className="meta">
              <div><dt>Límite</dt><dd>{fmtMoney(data.creditCard.creditLimit)}</dd></div>
              <div><dt>Interés anual</dt><dd>{fmtRate(data.creditCard.interestRate)}</dd></div>
              <div><dt>Últ. interés</dt><dd>{data.creditCard.lastInterestDate || "—"}</dd></div>
            </dl>
          </div>
        )}

        {data.studentChecking && (
          <div className="card">
            <h2 className="section-title">Student Checking</h2>
            <p>Sin propiedades adicionales.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function fmtMoney(n) {
  if (typeof n === "number") {
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return n ?? "—";
}
function fmtRate(n) {
  if (typeof n === "number") {
    return `${(n * 100).toFixed(2)}%`;
  }
  return n ?? "—";
}
