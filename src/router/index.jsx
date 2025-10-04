import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LandingPage from "../pages/LandingPage";
import AccountsListPage from "../pages/AccountsListPage";
import AccountDetailPage from "../pages/AccountDetailPage";
import AccountFormPage from "../pages/AccountFormPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

function IndexSwitch() {
  const { user } = useAuth();
  return user ? <DashboardPage /> : <LandingPage />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Home publica (landing) si no hay sesión; dashboard si la hay
      { index: true, element: <IndexSwitch /> },

      // Privadas
      { path: "dashboard", element: (
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      )},
      { path: "accounts", element: <AccountsListPage /> },
      { path: "accounts/:id", element: <AccountDetailPage /> },

      // Si decidiste mantener creación/edición, déjalas; si no, quítalas:
      { path: "accounts/new", element: (
        <ProtectedRoute><AccountFormPage /></ProtectedRoute>
      )},
      { path: "accounts/:id/edit", element: (
        <ProtectedRoute><AccountFormPage /></ProtectedRoute>
      )},

      // Públicas
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);

export default router;