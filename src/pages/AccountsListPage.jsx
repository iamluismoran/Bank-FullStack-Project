import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAccountsList } from "../hooks/useAccounts.js";
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

  useEffect(() => {
    const next = new URLSearchParams(sp);
    next.set("page", String(page));
    if (search) next.set("search", search);
    else next.delete("search");
    setSp(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const { data, isLoading, isError, error } = useAccountsList(search, page, pageSize);

  return (
    <div className="container">
      {}
      <div className="card accounts-header">
        <div className="header-row">
          <h1 className="title">Cuentas</h1>

          <div className="actions">
            <div className="accounts-search">
              <SearchBar value={search} onChange={(v) => { setPage(1); setSearch(v); }} />
            </div>

            <Link to="/accounts/new">
              <button>Crear cuenta</button>
            </Link>
          </div>
        </div>
      </div>

      {isLoading && <Spinner />}

      {isError && <Alert>Error: {error?.message || "No se pudo cargar el listado"}</Alert>}

      {data && data.items?.length === 0 && <EmptyState />}

      {data && data.items?.length > 0 && (
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
                {data.items.map((it) => (
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