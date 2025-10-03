import "../../styles/components/ui/Pagination.css";

export default function Pagination({ page, pageSize, total, onPage }) {
  const pages = Math.max(1, Math.ceil((total || 0) / (pageSize || 10)));

  return (
    <div className="pagination" role="navigation" aria-label="Paginación">
      <button disabled={page <= 1} onClick={() => onPage(1)}>{`«`}</button>
      <button disabled={page <= 1} onClick={() => onPage(page - 1)}>Anterior</button>
      <span> Página {page} / {pages} </span>
      <button disabled={page >= pages} onClick={() => onPage(page + 1)}>Siguiente</button>
      <button disabled={page >= pages} onClick={() => onPage(pages)}>{`»`}</button>
    </div>
  );
}