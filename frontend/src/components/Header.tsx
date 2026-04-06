import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  // Pull all necessary values from your context
  const { isAuthenticated, isAdmin, statusText, statusClassName } = useAuth();

  return (
    <header className="row bg-secondary text-white mb-4 p-3 rounded align-items-center">
      {/* Brand/Title Section */}
      <div className="col-lg-4">
        <h1 className="h3 mb-0">Angels' Landing</h1>
      </div>

      {/* Status Indicator (from Main) */}
      <div className="col-lg-4 mt-3 mt-lg-0 text-lg-center">
        <span className={statusClassName}>{statusText}</span>
      </div>

      {/* Navigation Section */}
      <div className="col-lg-4 mt-3 mt-lg-0">
        <nav className="d-flex gap-3 justify-content-lg-end flex-wrap">
          <NavLink className="text-white text-decoration-none" to="/catalog">
            Impact Dashboard
          </NavLink>
          <NavLink className="text-white text-decoration-none" to="/cookies">
            Cookies
          </NavLink>

          {/* Conditional Admin Link */}
          {isAdmin && (
            <NavLink className="text-white text-decoration-none" to="/admin/program-entries">
              Admin
            </NavLink>
          )}

          {/* Authentication Logic */}
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
      </div>
    </header>
  );
}

export default Header;