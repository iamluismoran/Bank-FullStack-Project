import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import AccountsListPage from "../pages/AccountsListPage";
import AccountDetailPage from "../pages/AccountDetailPage";
import AccountFormPage from "../pages/AccountFormPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

function IndexRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <IndexRedirect /> },

      { path: "dashboard", element: (
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      )},

      { path: "accounts", element: <AccountsListPage /> },
      { path: "accounts/:id", element: <AccountDetailPage /> },

      { path: "accounts/new", element: (
        <ProtectedRoute><AccountFormPage /></ProtectedRoute>
      )},
      { path: "accounts/:id/edit", element: (
        <ProtectedRoute><AccountFormPage /></ProtectedRoute>
      )},

      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);

export default router;