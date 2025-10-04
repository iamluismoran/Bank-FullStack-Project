import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  useCreateAccount,
  useAccountDetail,
  useUpdateStatus,
  useDeleteAccount,
} from "../hooks/useAccounts";
import Alert from "../components/feedback/Alert";
import Spinner from "../components/feedback/Spinner";

import "../styles/pages/AccountFormPage.css";

const TYPES = [
  { value: "CHECKING", label: "Checking" },
  { value: "STUDENT_CHECKING", label: "Student Checking" },
  { value: "SAVINGS", label: "Savings" },
  { value: "CREDIT_CARD", label: "Credit Card" },
];

export default function AccountFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  // detalle para edición
  const detailQ = useAccountDetail(id);
  const updateStatus = useUpdateStatus(id);
  const del = useDeleteAccount();

  // creación
  const create = useCreateAccount();

  // estado del formulario (creación)
  const [type, setType] = useState("CHECKING");
  const [form, setForm] = useState({
    primaryOwnerId: "",
    secondaryOwnerId: "",
    initialAmount: "",
    secretKey: "",
    minimumBalance: "",
    interestRate: "",
    creditLimit: "",
  });
  const [errors, setErrors] = useState([]);

  function validate() {
    const e = [];
    const n = (v) => Number(v);
    if (!form.primaryOwnerId) e.push("Primary owner ID is required.");
    if (!form.initialAmount || n(form.initialAmount) <= 0) e.push("Initial amount must be > 0.");
    if ((type === "CHECKING" || type === "STUDENT_CHECKING" || type === "SAVINGS") && !form.secretKey) {
      e.push("Secret key is required.");
    }
    if (type === "SAVINGS") {
      if (form.minimumBalance && n(form.minimumBalance) < 100) e.push("Minimum balance must be ≥ 100.");
      if (form.interestRate && !(n(form.interestRate) > 0 && n(form.interestRate) <= 0.5)) {
        e.push("Interest rate must be 0 < r ≤ 0.5.");
      }
    }
    if (type === "CREDIT_CARD") {
      if (form.creditLimit && !(n(form.creditLimit) >= 100 && n(form.creditLimit) <= 100000)) {
        e.push("Credit limit must be between 100 and 100000.");
      }
      if (form.interestRate && !(n(form.interestRate) >= 0.1 && n(form.interestRate) <= 0.2)) {
        e.push("Interest rate must be between 0.1 and 0.2.");
      }
    }
    setErrors(e);
    return e.length === 0;
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload = buildPayload(type, form);
      const created = await create.mutateAsync({ type, ...payload });
      const newId = created?.id;
      if (newId) navigate(`/accounts/${newId}`);
      else navigate(`/accounts`);
    } catch (err) {
      // El error se muestra con <Alert />
    }
  }

  // edición: cambiar estado y borrar
  async function onDelete() {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this account?")) return;
    await del.mutateAsync(id);
    navigate("/accounts");
  }

  return (
    <div className="container">
      {!isEdit && (
        <div className="card form-card">
          <div className="row form-header">
            <h1 className="title">Create Account</h1>
            <Link to="/accounts">← Back to list</Link>
          </div>

          {create.isError && <Alert>{create.error?.message || "Error creating account"}</Alert>}
          {errors.length > 0 && (
            <Alert>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </Alert>
          )}

          <form onSubmit={onSubmit} aria-live="assertive">
            <div className="grid-2">
              <div>
                <label htmlFor="type">Type</label>
                <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="primaryOwnerId">Primary owner ID *</label>
                <input id="primaryOwnerId" name="primaryOwnerId" value={form.primaryOwnerId} onChange={onChange} aria-invalid={!form.primaryOwnerId} />
              </div>

              <div>
                <label htmlFor="secondaryOwnerId">Secondary owner ID</label>
                <input id="secondaryOwnerId" name="secondaryOwnerId" value={form.secondaryOwnerId} onChange={onChange} />
              </div>

              <div>
                <label htmlFor="initialAmount">Initial amount *</label>
                <input id="initialAmount" name="initialAmount" value={form.initialAmount} onChange={onChange} aria-invalid={!form.initialAmount} />
              </div>

              {(type === "CHECKING" || type === "STUDENT_CHECKING" || type === "SAVINGS") && (
                <div>
                  <label htmlFor="secretKey">Secret key *</label>
                  <input id="secretKey" name="secretKey" value={form.secretKey} onChange={onChange} aria-invalid={!form.secretKey} />
                </div>
              )}

              {type === "SAVINGS" && (
                <>
                  <div>
                    <label htmlFor="minimumBalance">Minimum balance</label>
                    <input id="minimumBalance" name="minimumBalance" value={form.minimumBalance} onChange={onChange} />
                  </div>
                  <div>
                    <label htmlFor="interestRate">Interest rate (0–0.5)</label>
                    <input id="interestRate" name="interestRate" value={form.interestRate} onChange={onChange} />
                  </div>
                </>
              )}

              {type === "CREDIT_CARD" && (
                <>
                  <div>
                    <label htmlFor="creditLimit">Credit limit</label>
                    <input id="creditLimit" name="creditLimit" value={form.creditLimit} onChange={onChange} />
                  </div>
                  <div>
                    <label htmlFor="interestRate">Interest rate (0.1–0.2)</label>
                    <input id="interestRate" name="interestRate" value={form.interestRate} onChange={onChange} />
                  </div>
                </>
              )}
            </div>

            <div className="actions">
              <button type="submit" disabled={create.isPending}>
                {create.isPending ? "Creating..." : "Create"}
              </button>
              <p className="hint">
                Note: For Checking vs Student Checking, the backend decides the actual type based on age rules.
              </p>
            </div>
          </form>
        </div>
      )}

      {isEdit && (
        <>
          {detailQ.isLoading && <Spinner label="Loading account..." />}
          {detailQ.isError && <Alert>Error: {detailQ.error?.message || "Could not load account"}</Alert>}
          {detailQ.data && (
            <div className="card form-card">
              <div className="row form-header">
                <h1 className="title">Edit Account #{detailQ.data.id}</h1>
                <Link to={`/accounts/${detailQ.data.id}`}>← Back to detail</Link>
              </div>

              <div className="grid-2">
                <div>
                  <label>Status</label>
                  <div className="row gap-8">
                    <button
                      type="button"
                      disabled={detailQ.data.status === "ACTIVE" || updateStatus.isPending}
                      onClick={() => updateStatus.mutate("ACTIVE")}
                    >
                      Set ACTIVE
                    </button>
                    <button
                      type="button"
                      className=""
                      disabled={detailQ.data.status === "FROZEN" || updateStatus.isPending}
                      onClick={() => updateStatus.mutate("FROZEN")}
                    >
                      Set FROZEN
                    </button>
                    <button type="button" className="danger" disabled={del.isPending} onClick={onDelete}>
                      Delete
                    </button>
                  </div>
                </div>

                <div>
                  <p><strong>Type:</strong> {detailQ.data.type}</p>
                  <p><strong>Owner:</strong> {detailQ.data.primaryOwnerName} (ID {detailQ.data.primaryOwnerId})</p>
                  <p><strong>Created:</strong> {detailQ.data.creationDate}</p>
                </div>
              </div>

              {(updateStatus.isError || del.isError) && (
                <Alert>
                  {updateStatus.isError && <div>Could not update status.</div>}
                  {del.isError && <div>Could not delete account.</div>}
                </Alert>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
/**
 * buildPayload — convierte strings a números y asegura secondaryOwnerId.
 * Si secondaryOwnerId está vacío, usamos el mismo primaryOwnerId.
 */
function buildPayload(type, f) {
  const num = (v) =>
    v === "" || v === null || v === undefined ? undefined : Number(v);

  const primary = num(f.primaryOwnerId);
  const secondary =
    f.secondaryOwnerId === "" || f.secondaryOwnerId === null || f.secondaryOwnerId === undefined
      ? primary
      : num(f.secondaryOwnerId);

  const base = {
    primaryOwnerId: primary,
    secondaryOwnerId: secondary,
    initialAmount: num(f.initialAmount),
  };

  if (type === "CHECKING" || type === "STUDENT_CHECKING") {
    return { ...base, secretKey: f.secretKey };
  }
  if (type === "SAVINGS") {
    return {
      ...base,
      secretKey: f.secretKey,
      minimumBalance: f.minimumBalance ? num(f.minimumBalance) : undefined,
      interestRate: f.interestRate ? Number(f.interestRate) : undefined,
    };
    }
  if (type === "CREDIT_CARD") {
    return {
      ...base,
      creditLimit: f.creditLimit ? num(f.creditLimit) : undefined,
      interestRate: f.interestRate ? Number(f.interestRate) : undefined,
    };
  }
  return base;
}