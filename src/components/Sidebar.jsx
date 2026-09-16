import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearSession } from '../services/authService';
import useSessionUser, { displayNameFor, initialsFor } from '../hooks/useSessionUser';
import logo from '../assets/ifdc-logo.png';

const NAV_ITEMS = [
  { to: '/', icon: 'dashboard', label: 'Dashboard', end: true },
  { to: '/blogs', icon: 'article', label: 'Blogs & News' },
  { to: '/volunteers', icon: 'group', label: 'Volunteers' },
  { to: '/partners', icon: 'handshake', label: 'Partners' },
  { to: '/resources', icon: 'folder_shared', label: 'Resources' }
];

const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

const Sidebar = () => {
  const navigate = useNavigate();
  const user = useSessionUser();

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-brand" aria-label="IFDC Admin dashboard home">
          <span className="sidebar-logo-chip">
            <img src={logo} alt="IFDC" />
          </span>
          <span className="sidebar-brand-tag">Admin Portal</span>
        </NavLink>

        <div className="sidebar-user">
          <div className="sidebar-avatar" aria-hidden="true">{initialsFor(user)}</div>
          <div className="sidebar-user-text">
            <h2 className="sidebar-user-name" title={displayNameFor(user)}>{displayNameFor(user)}</h2>
            <p className="sidebar-user-role" title={user?.email}>{user?.role || 'Management Portal'}</p>
          </div>
        </div>
      </div>

      <div className="sidebar-nav">
        <p className="sidebar-section-label">Menu</p>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="sidebar-bottom">
          <NavLink to="/settings" className={linkClass}>
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </NavLink>
          <button type="button" onClick={handleLogout} className="nav-link nav-link-button">
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
