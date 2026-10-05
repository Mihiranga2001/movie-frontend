import { Link, useRouteError } from "react-router-dom";

function NotFound() {
  // Also used as the router errorElement, so surface the reason when there is one.
  const routeError = useRouteError() as { statusText?: string; message?: string } | null;
  const detail = routeError?.statusText ?? routeError?.message ?? null;

  return (
    <div className="state-block">
      <h1>404 — page not found</h1>
      <p>The page you are looking for does not exist or has been moved.</p>
      {detail && <p className="muted">{detail}</p>}
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}

export default NotFound;
