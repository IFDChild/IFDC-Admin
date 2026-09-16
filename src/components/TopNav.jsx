import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearSession } from '../services/authService';
import useSessionUser, { displayNameFor, initialsFor } from '../hooks/useSessionUser';

const formatLastLogin = (value) => {
  if (!value) return null;
  // The API returns naive UTC timestamps.
  const date = new Date(/[zZ]|[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const TopNav = () => {
  const navigate = useNavigate();
  const user = useSessionUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  const lastLogin = formatLastLogin(user?.last_login_at);

  return (
    <header className="top-nav">
      <div className="search-container">
        <span className="material-symbols-outlined text-outline">search</span>
        <input
          className="search-input"
          placeholder="Search across dashboard..."
          type="text"
        />
      </div>

      <div className="top-nav-actions" ref={menuRef}>
        <button
          type="button"
          className="profile-trigger"
          onClick={() => setOpen((value) => !value)}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <span className="profile-avatar" aria-hidden="true">{initialsFor(user)}</span>
          <span className="profile-text">
            <span className="profile-name">{displayNameFor(user)}</span>
            <span className="profile-role">{user?.role || 'Administrator'}</span>
          </span>
          <span className="material-symbols-outlined profile-caret" aria-hidden="true">expand_more</span>
        </button>

        {open && (
          <div className="profile-menu" role="menu">
            <div className="profile-menu-head">
              <span className="profile-avatar profile-avatar-lg" aria-hidden="true">{initialsFor(user)}</span>
              <div className="min-w-0">
                <p className="profile-menu-name">{displayNameFor(user)}</p>
                <p className="profile-menu-email">{user?.email}</p>
              </div>
            </div>

            <dl className="profile-menu-meta">
              <div>
                <dt>Role</dt>
                <dd>{user?.role || '—'}</dd>
              </div>
              {lastLogin && (
                <div>
                  <dt>Last sign-in</dt>
                  <dd>{lastLogin}</dd>
                </div>
              )}
            </dl>

            <button
              type="button"
              role="menuitem"
              className="profile-menu-item"
              onClick={() => {
                setOpen(false);
                navigate('/settings');
              }}
            >
              <span className="material-symbols-outlined">settings</span>
              Settings
            </button>
            <button type="button" role="menuitem" className="profile-menu-item danger" onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span>
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNav;
