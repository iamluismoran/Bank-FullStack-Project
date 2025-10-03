import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import AccountsListPage from "../pages/AccountsListPage";
import AccountDetailPage from "../pages/AccountDetailPage";
import AccountFormPage from "../pages/AccountFormPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Home como página principal
      { index: true, element: <HomePage /> },

      // Cuentas
      { path: "accounts", element: <AccountsListPage /> },
      { path: "accounts/:id", element: <AccountDetailPage /> },
      { path: "accounts/new", element: (
          <ProtectedRoute>
            <AccountFormPage />
          </ProtectedRoute>
        ) },
      { path: "accounts/:id/edit", element: (
          <ProtectedRoute>
            <AccountFormPage />
          </ProtectedRoute>
        ) },

      // Auth
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);

export default router;