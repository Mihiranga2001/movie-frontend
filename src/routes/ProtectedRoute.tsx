import { Navigate, Outlet, useLocation } from "react-router-dom";

import Loader from "../components/common/Loader";
import { useAuth } from "../hooks/useAuth";

interface Props {
  /** When true the route also requires the ADMIN role. */
  adminOnly?: boolean;
}

/**
 * Guards routes that need a session. The original app let anyone open
 * /admin simply by typing the URL.
 */
function ProtectedRoute({ adminOnly = false }: Props) {
  const { isAuthenticated, isAdmin, initialising } = useAuth();
  const location = useLocation();

  // Wait for the stored token to be validated, otherwise a refresh on a
  // protected page would bounce the user to /login every time.
  if (initialising) {
    return <Loader label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="state-block state-error" role="alert">
        <h1>403 — not allowed</h1>
        <p>This area is for administrators only.</p>
      </div>
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
