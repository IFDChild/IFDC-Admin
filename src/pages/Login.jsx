import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, saveSession } from '../services/authService';
import './Login.css';

const PRESET_ROLES = [
  {
    id: 'admin',
    label: 'Admin',
    email: 'admin@ifdchild.org',
    roleTag: 'System Administrator',
    defaultPassword: 'Admin@ifdc'
  },
  {
    id: 'editor',
    label: 'Editor',
    email: 'editor@ifdchild.org',
    roleTag: 'Content Editor',
    defaultPassword: 'ChildSafetyEditor2024!'
  },
  {
    id: 'coordinator',
    label: 'Coordinator',
    email: 'coordinator@ifdchild.org',
    roleTag: 'Volunteer Coordinator',
    defaultPassword: 'VolunteerCoord2024!'
  }
];

const Login = () => {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(PRESET_ROLES[0]);
  const [email, setEmail] = useState(PRESET_ROLES[0].email);
  const [password, setPassword] = useState(PRESET_ROLES[0].defaultPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setEmail(role.email);
    setPassword(role.defaultPassword);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const data = await loginUser(email, password, rememberDevice);
      saveSession(data);
      navigate('/');
    } catch (err) {
      setErrorMessage(
        err instanceof TypeError
          ? 'Could not reach the server. Is the API running?'
          : err.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      {/* Ambient background glows */}
      <div className="login-glow-1" />
      <div className="login-glow-2" />

      <div className="login-container">
        {/* Security / Authorized Personnel Badge */}
        <div className="login-security-badge">
          <span className="pulse-dot" />
          <span>Restricted Access • Authorized Personnel Only</span>
        </div>

        {/* Main Card */}
        <div className="login-card">
          {/* Brand Header */}
          <div className="login-brand-header">
            <div className="w-48 mb-2 flex items-center justify-center">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1Uudh8Vw-1avkUCOyMgfIjKn4G3zDBdwMavsaDC9dhdrqZ7P0AV4nJefxTzBgvZAakkw0FgsuUXscZibvrLC7w-frYFbOVlYTCkv5F0hdrhz2rUleryjlUT-GTLX2fOZJolyWAAAV1LtduQsMdFRgH8XeC7AF-jGU1S0b8i3Gvl2HhhvgJaiSNKjunERIKjwJFaHkIEjzqAzmH-QCcUtA7dLZfOVhfn9VDiOaWZpCTxqWkOzKjhkmxhVTy7eHwWS9pkPSByAFISDw"
                alt="IFDC Logo"
                className="login-brand-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = document.getElementById('logo-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                id="logo-fallback"
                style={{ display: 'none' }}
                className="items-center gap-2 mb-3"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FFE100] flex items-center justify-center text-[#0B3D6E] font-bold">
                  <span className="material-symbols-outlined text-[20px]">shield</span>
                </div>
                <span className="text-2xl font-bold text-[#0B3D6E] tracking-tight">IFDC.</span>
              </div>
            </div>

            <div className="login-portal-pill">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              <span>Management Portal</span>
            </div>

            <h1 className="login-title">Welcome Back</h1>
            <p className="login-description">
              Sign in with your administrative credentials to manage child safety initiatives, resources, and community networks.
            </p>
          </div>




          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Work Email */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="workEmail">Work Email</label>
                <span className="role-tag-badge">{selectedRole.roleTag}</span>
              </div>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon">mail</span>
                <input
                  id="workEmail"
                  type="email"
                  required
                  className="login-input"
                  placeholder="admin@ifdchild.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="adminPassword">Password</label>
              </div>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon">lock</span>
                <input
                  id="adminPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="login-input has-toggle"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label="Toggle password view"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="form-options-row">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                />
                <span>Remember this device</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert('For password resets, contact IT Security Operations at support@ifdchild.org');
                }}
                className="forgot-link"
              >
                Forgot password?
              </a>
            </div>

            {/* 2FA Notice Box */}
            <div className="two-factor-notice">
              <span className="material-symbols-outlined">verified_user</span>
              <p>
                Hardware security key or authenticator app will be required for elevated administrative roles.
              </p>
            </div>

            {/* Primary CTA Button */}
            <button
              id="submitBtn"
              type="submit"
              disabled={isSubmitting}
              className="login-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined spin-icon text-[20px]">sync</span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Trust & Security Footer */}
        <footer className="login-footer">
          <div className="ssl-badge">
            <span className="material-symbols-outlined">lock_clock</span>
            <span>Secure 256-bit SSL Encrypted Connection</span>
          </div>

          <div className="login-quick-links">
            <a href="#security" onClick={(e) => e.preventDefault()}>Security Policy</a>
            <span>•</span>
            <a href="#helpdesk" onClick={(e) => e.preventDefault()}>IT Helpdesk Support</a>
            <span>•</span>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Access</a>
          </div>

          <p className="login-copyright">
            © 2024 International Foundation for Digital Child (IFDC). All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
