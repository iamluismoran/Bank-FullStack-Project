import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/feedback/Spinner";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container">
        <Spinner label="Checking session..." />
      </div>
    );
  }

  if (!user) {
    const params = new URLSearchParams({ redirect: location.pathname + location.search });
    return <Navigate to={`/login?${params.toString()}`} replace />;
  }

  return children;
}
