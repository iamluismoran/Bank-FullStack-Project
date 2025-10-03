import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import AccountsListPage from "../pages/AccountsListPage";
import AccountDetailPage from "../pages/AccountDetailPage";
import AccountFormPage from "../pages/AccountFormPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },

      // Perfil real (dashboard)
      { path: "dashboard", element: (
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        ) },

      { path: "accounts", element: <AccountsListPage /> },
      { path: "accounts/:id", element: <AccountDetailPage /> },
      { path: "accounts/new", element: (
          <ProtectedRoute><AccountFormPage /></ProtectedRoute>
        ) },
      { path: "accounts/:id/edit", element: (
          <ProtectedRoute><AccountFormPage /></ProtectedRoute>
        ) },

      // Página de ajustes dev (opcional)
      { path: "profile", element: (
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        ) },

      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);

export default router;
