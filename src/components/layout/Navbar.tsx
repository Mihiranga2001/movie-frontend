import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = localStorage.getItem("user");
  const loggedUser = user ? JSON.parse(user) : null;

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <h2>MovieWeb</h2>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/movies">Movies</NavLink>
        <NavLink to="/series">TV Series</NavLink>

        {loggedUser?.role === "ADMIN" && (
          <NavLink to="/admin">Admin</NavLink>
        )}

        {!loggedUser ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        ) : (
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;