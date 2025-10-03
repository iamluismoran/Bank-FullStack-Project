import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import AccountsListPage from "../pages/AccountsListPage";

function LoginPlaceholder() {
  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Login</h1>
        <p>Falta la autenticación</p>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/accounts" replace /> },
      { path: "accounts", element: <AccountsListPage /> },
      { path: "login", element: <LoginPlaceholder /> },
    ],
  },
]);

export default router;