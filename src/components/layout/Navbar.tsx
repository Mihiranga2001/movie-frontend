import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    // React Router navigation — no full page reload needed.
    navigate("/login", { replace: true });
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <NavLink to="/" className="brand" onClick={closeMenu}>
        Movie<span>Web</span>
      </NavLink>

      <button
        type="button"
        className="nav-toggle"
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        ☰
      </button>

      <div className={menuOpen ? "nav-links open" : "nav-links"}>
        <NavLink to="/" end onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/movies" onClick={closeMenu}>
          Movies
        </NavLink>
        <NavLink to="/series" onClick={closeMenu}>
          TV Series
        </NavLink>

        {isAuthenticated && (
          <NavLink to="/history" onClick={closeMenu}>
            My List
          </NavLink>
        )}

        {isAdmin && (
          <NavLink to="/admin" onClick={closeMenu}>
            Admin
          </NavLink>
        )}

        {isAuthenticated ? (
          <div className="nav-user">
            <span className="nav-username">{user?.username}</span>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <NavLink to="/login" onClick={closeMenu}>
              Login
            </NavLink>
            <NavLink to="/register" className="nav-cta" onClick={closeMenu}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
