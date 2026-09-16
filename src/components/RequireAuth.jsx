import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  clearSession,
  fetchCurrentUser,
  getSession,
  UnauthorizedError,
  updateSessionUser
} from '../services/authService';

/**
 * Guards the dashboard: no stored session → login page. A stored session
 * is re-checked against /api/auth/me so revoked or expired tokens bounce too.
 */
const RequireAuth = ({ children }) => {
  const location = useLocation();
  const [status, setStatus] = useState(() => (getSession() ? 'checking' : 'signed-out'));

  useEffect(() => {
    if (status !== 'checking') return;
    let cancelled = false;

    fetchCurrentUser()
      .then((user) => {
        if (cancelled) return;
        updateSessionUser(user);
        setStatus('signed-in');
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof UnauthorizedError) {
          clearSession();
          setStatus('signed-out');
        } else {
          // API unreachable: keep the (unexpired) local session usable.
          setStatus('signed-in');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  if (status === 'signed-out') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] text-[#0b3d6e]">
        <span className="material-symbols-outlined animate-spin text-[28px]" aria-label="Verifying session">progress_activity</span>
      </div>
    );
  }

  return children;
};

export default RequireAuth;
