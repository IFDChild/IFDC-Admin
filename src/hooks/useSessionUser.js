import { useEffect, useState } from 'react';
import { getSession, SESSION_EVENT } from '../services/authService';

export const initialsFor = (user) => {
  const source = (user?.full_name || user?.email || 'IFDC Admin').trim();
  const words = source.split(/[\s@._-]+/).filter(Boolean);
  const letters = words.length > 1 ? words[0][0] + words[1][0] : source.slice(0, 2);
  return letters.toUpperCase();
};

export const displayNameFor = (user) => user?.full_name || user?.email?.split('@')[0] || 'IFDC Admin';

/** The signed-in user, kept in sync with login, /me refreshes and logout. */
const useSessionUser = () => {
  const [user, setUser] = useState(() => getSession()?.user ?? null);

  useEffect(() => {
    const sync = () => setUser(getSession()?.user ?? null);
    window.addEventListener(SESSION_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SESSION_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return user;
};

export default useSessionUser;
