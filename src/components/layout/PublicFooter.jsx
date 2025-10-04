import useHealth from "../../hooks/useHealth";
import "../../styles/components/layout/Footer.css";

export default function PublicFooter() {
  const { data, isFetching, refetch } = useHealth();
  const ok = data?.status === "UP" && data?.db === "UP";

  return (
    <footer className="public-footer">
      <button
        type="button"
        className={`badge ${ok ? "success" : "danger"} health-btn`}
        onClick={() => refetch()}
        aria-busy={isFetching}
        aria-live="polite"
        title="Probar conexión"
      >
        {ok ? "Conexión abierta" : "Sin conexión"}
      </button>
    </footer>
  );
}