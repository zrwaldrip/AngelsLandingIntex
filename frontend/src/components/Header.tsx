import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-dark text-white p-4 mb-4 rounded text-center">
      <h1 className="mb-3">Angels Landing</h1>

      <nav className="d-flex justify-content-center gap-3 flex-wrap">
        <NavLink className="text-white text-decoration-none" to="/">
          Home
        </NavLink>

        <NavLink className="text-white text-decoration-none" to="/cookies">
          Cookies
        </NavLink>

        {!isAuthenticated ? (
          <>
            <NavLink className="text-white text-decoration-none" to="/login">
              Login
            </NavLink>
            <NavLink className="text-white text-decoration-none" to="/register">
              Register
            </NavLink>
          </>
        ) : (
          <>
            <NavLink className="text-white text-decoration-none" to="/mfa">
              MFA
            </NavLink>
            <NavLink className="text-white text-decoration-none" to="/logout">
              Logout
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;