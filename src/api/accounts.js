/**
 * Listado de cuentas con búsqueda y paginación
 * GET /api/accounts?search=&page=&pageSize=
 */
export async function listAccounts({ search = "", page = 1, pageSize = 10 } = {}) {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("pageSize", pageSize);
  if (search?.trim()) params.set("search", search.trim());

  const res = await fetch(`/api/accounts?${params.toString()}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Error al cargar cuentas: ${res.status}`);
  return res.json(); // { items, total, page, pageSize }
}

/**
 * Detalle de una cuenta
 * GET /api/accounts/:id
 */
export async function getAccount(id) {
  const res = await fetch(`/api/accounts/${id}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Error loading account ${id}: ${res.status}`);
  return res.json(); // AccountDetail
}

/**
 * GET /api/accounts/:id/balance
 */
export async function getAccountBalance(id) {
  const res = await fetch(`/api/accounts/${id}/balance`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Error loading balance for ${id}: ${res.status}`);

  // El backend puede devolver { accountId, balance } o un número plano.
  const data = await res.json();
  if (typeof data === "number") return data;
  if (typeof data === "string") return Number(data);
  return Number(data?.balance ?? data?.amount ?? 0);
}

/**
 * POST /api/accounts/transfer
 */
export async function transfer({ fromAccountId, toAccountId, amount, requestOwnerId }) {
  const payload = {
    fromAccountId: Number(fromAccountId),
    toAccountId: Number(toAccountId),
    amount: Number(amount),
    requestOwnerId: Number(requestOwnerId),
  };

  const res = await fetch(`/api/accounts/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = `Error al transferir: ${res.status}`;
    try { msg += ` - ${await res.text()}`; } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return true;
  try { return await res.json(); } catch { return true; }
}


/* ===========================
 *      CREATE (3 tipos)
 * =========================== */

export async function createCheckingOrStudent(payload) {
  const res = await fetch(`/api/admin/accounts/checking-or-student`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = `Error creating checking/student: ${res.status}`;
    try { msg += ` - ${await res.text()}`; } catch {}
    throw new Error(msg);
  }
  return res.json(); // cuenta creada
}

export async function createSavings(payload) {
  const res = await fetch(`/api/admin/accounts/savings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = `Error creating savings: ${res.status}`;
    try { msg += ` - ${await res.text()}`; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function createCreditCard(payload) {
  const res = await fetch(`/api/admin/accounts/credit-card`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = `Error creating credit card: ${res.status}`;
    try { msg += ` - ${await res.text()}`; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

/* ===========================
 *    UPDATE STATUS / DELETE
 * =========================== */

export async function updateAccountStatus(id, status) {
  const url = `/api/admin/accounts/${id}/status?status=${encodeURIComponent(status)}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Error updating status: ${res.status}`);
  return true;
}

export async function deleteAccount(id) {
  const res = await fetch(`/api/admin/accounts/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Error deleting account: ${res.status}`);
  return true;
}