import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAccountsList } from "../hooks/useAccounts.js";
import { useDemoProfile } from "../context/ProfileContext";
import Pagination from "../components/ui/Pagination.jsx";
import Spinner from "../components/feedback/Spinner.jsx";
import Alert from "../components/feedback/Alert.jsx";
import EmptyState from "../components/feedback/EmptyState.jsx";

import "../styles/pages/AccountsListPage.css";
import "../styles/components/ui/Table.css";

export default function AccountsListPage() {
  const [sp, setSp] = useSearchParams();
  const [page, setPage] = useState(Number(sp.get("page") || 1));
  const [pageSize] = useState(10);

  // Perfil: tomamos ownerId
  const { ownerId } = useDemoProfile();

  // Sincronizar solo la página en la URL
  useEffect(() => {
    const next = new URLSearchParams(sp);
    next.set("page", String(page));
    setSp(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Cargar lista desde backend
  const { data, isLoading, isError, error } = useAccountsList("", page, pageSize);

  // Filtramos SIEMPRE por ownerId
  const visibleItems = useMemo(() => {
    const items = data?.items || [];
    if (!ownerId) return []; // si no hay ownerId, no mostramos nada
    return items.filter((it) => it.primaryOwnerId === ownerId);
  }, [data, ownerId]);

  return (
    <div className="container">
      <div className="card accounts-header">
        <div className="header-row" style={{ gap: 12 }}>
          <h1 className="title" style={{ margin: 0 }}>Cuentas</h1>

          {ownerId && (
            <span className="badge" title={`Owner ID: ${ownerId}`} style={{ marginLeft: "auto" }}>
              Mis cuentas (Owner {ownerId})
            </span>
          )}
        </div>
      </div>

      {isLoading && <Spinner />}

      {isError && <Alert>Error: {error?.message || "No se pudo cargar el listado"}</Alert>}

      {!ownerId && !isLoading && (
        <Alert>
          No hay Owner asignado a tu usuario. Inicia sesión con un usuario válido.
        </Alert>
      )}

      {ownerId && data && visibleItems.length === 0 && (
        <EmptyState>Sin resultados.</EmptyState>
      )}

      {ownerId && data && visibleItems.length > 0 && (
        <div className="card">
          <div className="table-wrap">
            <table className="table" role="table" aria-label="Listado de mis cuentas">
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