import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAccountsList } from "../hooks/useAccounts";
import Pagination from "../components/ui/Pagination";
import SearchBar from "../components/ui/SearchBar";
import Spinner from "../components/feedback/Spinner";
import Alert from "../components/feedback/Alert";
import EmptyState from "../components/feedback/EmptyState";

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
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h1 style={{ margin: 0 }}>Cuentas</h1>
          <div style={{ width: 320, maxWidth: "100%" }}>
            <SearchBar value={search} onChange={(v) => { setPage(1); setSearch(v); }} />
          </div>
        </div>
      </div>

      {isLoading && <Spinner />}

      {isError && <Alert>Error: {error?.message || "No se pudo cargar el listado"}</Alert>}

      {data && data.items?.length === 0 && <EmptyState />}

      {data && data.items?.length > 0 && (
        <div className="card">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #24305f" }}>ID</th>
                  <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #24305f" }}>Titular</th>
                  <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #24305f" }}>Tipo</th>
                  <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #24305f" }}>Estado</th>
                  <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #24305f" }}>Creación</th>
                  <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #24305f" }}></th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((it) => (
                  <tr key={it.id}>
                    <td style={{ padding: 10, borderBottom: "1px solid #24305f" }}>{it.id}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #24305f" }}>{it.primaryOwnerName}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #24305f" }}>{it.type}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #24305f" }}>{it.status}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #24305f" }}>{it.creationDate}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #24305f" }}>
                      <Link to={`/accounts/${it.id}`}>Ver</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 12 }}>
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
