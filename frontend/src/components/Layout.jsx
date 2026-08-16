import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, clearAuth } from '../services/auth';
import './Layout.css';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  function handleLogout() {
    clearAuth();
    navigate('/');
  }

  return (
    <div className="layout">
      {authenticated && (
        <header className="header">
          <div className="container header-content">
            <div className="logo">
              <h1>👥 Employee Management</h1>
            </div>
            <nav className="nav">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/employees">Employees</Link>
              <Link to="/departments">Departments</Link>
              <button className="btn-secondary btn-small" onClick={handleLogout}>
                Logout
              </button>
            </nav>
          </div>
        </header>
      )}
      <main className="main">
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
