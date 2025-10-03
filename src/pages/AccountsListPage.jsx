import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAccountsList } from "../hooks/useAccounts.js";
import { useDemoProfile } from "../context/ProfileContext"; 
import Pagination from "../components/ui/Pagination.jsx";
import SearchBar from "../components/ui/SearchBar.jsx";
import Spinner from "../components/feedback/Spinner.jsx";
import Alert from "../components/feedback/Alert.jsx";
import EmptyState from "../components/feedback/EmptyState.jsx";

import "../styles/pages/AccountsListPage.css";
import "../styles/components/ui/Table.css";

export default function AccountsListPage() {
  const [sp, setSp] = useSearchParams();
  const [page, setPage] = useState(Number(sp.get("page") || 1));
  const [pageSize] = useState(10);
  const [search, setSearch] = useState(sp.get("search") || "");

  // Perfil: ownerId y toggle "solo mis cuentas"
  const { ownerId, showMineOnly, setShowMineOnly } = useDemoProfile();

  // Sincronizar URL con estado local
  useEffect(() => {
    const next = new URLSearchParams(sp);
    next.set("page", String(page));
    if (search) next.set("search", search);
    else next.delete("search");
    setSp(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  // Cargar lista desde backend (sin filtro de owner en el server)
  const { data, isLoading, isError, error } = useAccountsList(search, page, pageSize);

  // Filtrado en cliente por ownerId cuando el toggle está activo
  const visibleItems = useMemo(() => {
    const items = data?.items || [];
    if (showMineOnly && ownerId) {
      return items.filter((it) => it.primaryOwnerId === ownerId);
    }
    return items;
  }, [data, showMineOnly, ownerId]);

  return (
    <div className="container">
      <div className="card accounts-header">
        <div className="header-row" style={{ gap: 12 }}>
          <h1 className="title" style={{ margin: 0 }}>Cuentas</h1>

          <div className="actions" style={{ display: "flex", gap: 12, marginLeft: "auto" }}>
            <div className="accounts-search">
              <SearchBar value={search} onChange={(v) => { setPage(1); setSearch(v); }} />
            </div>

            {/* Toggle solo visible si conocemos el ownerId */}
            {ownerId && (
              <label className="checkbox" title={`Owner ID: ${ownerId}`}>
                <input
                  type="checkbox"
                  checked={showMineOnly}
                  onChange={(e) => setShowMineOnly(e.target.checked)}
                />
                <span>Mis cuentas (Owner {ownerId})</span>
              </label>
            )}

            <Link to="/accounts/new">
              <button>Crear cuenta</button>
            </Link>
          </div>
        </div>
      </div>

      {isLoading && <Spinner />}

      {isError && <Alert>Error: {error?.message || "No se pudo cargar el listado"}</Alert>}

      {data && visibleItems.length === 0 && (
        <EmptyState>
          Sin resultados {ownerId && showMineOnly ? "(filtrando por tus cuentas)" : ""}.
        </EmptyState>
      )}

      {data && visibleItems.length > 0 && (
        <div className="card">
          <div className="table-wrap">
            <table className="table" role="table" aria-label="Listado de cuentas">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titular</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Creación</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((it) => (
                  <tr key={it.id}>
                    <td>{it.id}</td>
                    <td>{it.primaryOwnerName}</td>
                    <td>{it.type}</td>
                    <td>{it.status}</td>
                    <td>{it.creationDate}</td>
                    <td><Link to={`/accounts/${it.id}`}>Ver</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* La paginación usa el total del server: OK para demo */}
          <div className="accounts-pagination">
            <Pagination
              page={page}
              pageSize={pageSize}
              total={data.total}
              onPage={(p) => setPage(p)}
            />
          </div>
        </div>
      )}
    </div>
  );
}