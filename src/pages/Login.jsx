import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getSession, loginUser, saveSession } from '../services/authService';
import logo from '../assets/ifdc-logo.png';
import './Login.css';

const HIGHLIGHTS = [
  { icon: 'group', title: 'Volunteers', text: 'Review and approve applications' },
  { icon: 'folder_shared', title: 'Resources', text: 'Publish guides for parents, children and media' },
  { icon: 'article', title: 'Blogs & News', text: 'Share stories from our programmes' }
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotHelp, setShowForgotHelp] = useState(false);

  if (getSession()) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const data = await loginUser(email.trim(), password, rememberDevice);
      saveSession(data, rememberDevice);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setPassword('');
      setErrorMessage(
        err instanceof TypeError
          ? 'Could not reach the server. Please check the API is running and try again.'
          : err.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackCapsLock = (e) => {
    if (typeof e.getModifierState === 'function') {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  return (
    <div className="auth-shell">
      {/* ── Brand panel ── */}
      <aside className="auth-brand">
        <div className="auth-brand-rings" aria-hidden="true">
          <span /><span /><span />
        </div>

        <div className="auth-brand-top">
          <span className="auth-logo-chip">
            <img src={logo} alt="IFDC" />
          </span>
          <span className="auth-brand-tag">Admin Portal</span>
        </div>

        <div className="auth-brand-body">
          <h1>
            Keeping every child <span>safe online</span> starts here.
          </h1>
          <p>
            Manage the people, programmes and resources behind the International Foundation for Digital Child.
          </p>

          <ul className="auth-highlights">
            {HIGHLIGHTS.map((item) => (
              <li key={item.title}>
                <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="auth-brand-foot">© {new Date().getFullYear()} IFDC · Sri Lanka</p>
      </aside>

      {/* ── Form panel ── */}
      <main className="auth-main">
        <div className="auth-card">
          <img src={logo} alt="IFDC" className="auth-card-logo" />

          <div className="auth-heading">
            <p className="auth-eyebrow">
              <span className="auth-dot" aria-hidden="true" />
              Authorised staff only
            </p>
            <h2>Sign in</h2>
            <p>Use your IFDC staff email and password to continue.</p>
          </div>

          {errorMessage && (
            <div className="auth-alert" role="alert">
              <span className="material-symbols-outlined" aria-hidden="true">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate={false}>
            <div className="auth-field">
              <label htmlFor="loginEmail">Email address</label>
              <div className="auth-input">
                <span className="material-symbols-outlined" aria-hidden="true">mail</span>
                <input
                  id="loginEmail"
                  type="email"
                  autoComplete="username"
                  required
                  autoFocus
                  placeholder="you@ifdchild.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="loginPassword">Password</label>
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => setShowForgotHelp((open) => !open)}
                  aria-expanded={showForgotHelp}
                >
                  Forgot password?
                </button>
              </div>
              <div className="auth-input">
                <span className="material-symbols-outlined" aria-hidden="true">lock</span>
                <input
                  id="loginPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={trackCapsLock}
                  onKeyDown={trackCapsLock}
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPassword((show) => !show)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {capsLockOn && (
                <p className="auth-hint">
                  <span className="material-symbols-outlined" aria-hidden="true">keyboard_capslock</span>
                  Caps Lock is on
                </p>
              )}
              {showForgotHelp && (
                <p className="auth-help">
                  Password resets are handled by your system administrator. Email{' '}
                  <a href="mailto:ifdchild@gmail.com">ifdchild@gmail.com</a> from your staff address.
                </p>
              )}
            </div>

            <label className="auth-check">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
              />
              <span>
                Keep me signed in for 30 days
                <small>Only on a private device</small>
              </span>
            </label>

            <button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined auth-spin" aria-hidden="true">progress_activity</span>
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <p className="auth-secure">
            <span className="material-symbols-outlined" aria-hidden="true">shield_lock</span>
            Repeated failed attempts temporarily lock sign-in.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
