import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UiContext';
import {
  APP_NAME,
  AUTH_NAV_LINKS,
  DASHBOARD_LINKS,
  NAV_LINKS,
  ORGANIZER_NAV_LINKS
} from '../utils/constants';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { showToast } = useUI();
  const [open, setOpen] = useState(false);

  const dashboardLink = user ? DASHBOARD_LINKS[user.role] : null;
  // avoid duplicate dashboard link when role-specific nav already includes it
  const roleLinks = user && user.role === 'organizer' ? ORGANIZER_NAV_LINKS : [];

  const handleLogout = () => {
    logout();
    showToast({ message: 'Logged out', type: 'success' });
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="brand">
          <span className="brand__mark">E</span>
          <span>{APP_NAME}</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <nav className={`nav-links ${open ? 'nav-open' : ''}`} aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <>
              {user.role === 'organizer'
                ? ORGANIZER_NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                      {link.label}
                    </NavLink>
                  ))
                : null}
              {dashboardLink && ![...NAV_LINKS, ...roleLinks].some((l) => l.to === dashboardLink.to) ? (
                <NavLink
                  to={dashboardLink.to}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {dashboardLink.label}
                </NavLink>
              ) : null}
              <span className="role-pill">{user.role}</span>
              <button type="button" className="btn btn--ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              {AUTH_NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/register" className="btn btn--primary">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
