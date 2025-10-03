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
