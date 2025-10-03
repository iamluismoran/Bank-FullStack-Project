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
 * Saldo en vivo (aplica intereses/reglas en backend)
 * GET /api/accounts/:id/balance
 */
export async function getAccountBalance(id) {
  const res = await fetch(`/api/accounts/${id}/balance`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Error loading balance for ${id}: ${res.status}`);
  return res.json(); // { accountId, balance }
}
