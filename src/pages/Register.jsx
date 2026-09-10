import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

const ROLE_OPTIONS = [
  { value: 'System Administrator', label: 'System Administrator', code: 'ADMIN' },
  { value: 'Content Editor', label: 'Content & Editorial Lead', code: 'EDITOR' },
  { value: 'Volunteer Coordinator', label: 'Volunteer & Field Ops', code: 'COORD' },
  { value: 'Child Safety Officer', label: 'Child Protection & Compliance', code: 'SAFETY' }
];

const Register = () => {
  const navigate = useNavigate();

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(ROLE_OPTIONS[0].value);
  const [department, setDepartment] = useState('Central Administration');
  const [clearanceKey, setClearanceKey] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegisteredSuccess, setIsRegisteredSuccess] = useState(false);

  // Password rules validation
  const passwordCriteria = useMemo(() => {
    return {
      hasMinLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [password]);

  const strengthScore = useMemo(() => {
    return Object.values(passwordCriteria).filter(Boolean).length;
  }, [passwordCriteria]);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your entry.');
      return;
    }

    if (strengthScore < 3) {
      setErrorMessage('Please ensure your password meets security guidelines (at least 3 criteria satisfied).');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('You must acknowledge and accept the Child Data Governance & Privacy Protocol.');
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        full_name: fullName.trim(),
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        department,
        clearance_key: clearanceKey.trim() || undefined,
      });

      setIsRegisteredSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please contact your IT administrator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F7F9FB] px-4 py-10 relative overflow-x-hidden font-['Open_Sans',sans-serif]">
      {/* Ambient background glows */}
      <div className="absolute top-[5%] left-[15%] w-96 h-96 bg-[#0B3D6E]/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-[5%] right-[15%] w-96 h-96 bg-[#FFE100]/20 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="w-full max-w-[540px] flex flex-col items-center relative z-10">
        {/* Institutional Security Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-200/80 border border-slate-300/60 rounded-full text-xs font-semibold text-slate-700 shadow-sm mb-5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#008575]" />
          </span>
          <span>Institutional Access • Admin Identity Onboarding</span>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white rounded-2xl p-7 sm:p-9 shadow-[0_16px_40px_-8px_rgba(11,61,110,0.08),0_4px_16px_-2px_rgba(11,61,110,0.04)] border border-slate-200/70 flex flex-col gap-6">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-48 mb-2 flex items-center justify-center">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1Uudh8Vw-1avkUCOyMgfIjKn4G3zDBdwMavsaDC9dhdrqZ7P0AV4nJefxTzBgvZAakkw0FgsuUXscZibvrLC7w-frYFbOVlYTCkv5F0hdrhz2rUleryjlUT-GTLX2fOZJolyWAAAV1LtduQsMdFRgH8XeC7AF-jGU1S0b8i3Gvl2HhhvgJaiSNKjunERIKjwJFaHkIEjzqAzmH-QCcUtA7dLZfOVhfn9VDiOaWZpCTxqWkOzKjhkmxhVTy7eHwWS9pkPSByAFISDw"
                alt="IFDC Logo"
                className="max-w-[170px] h-auto mb-2"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = document.getElementById('reg-logo-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                id="reg-logo-fallback"
                style={{ display: 'none' }}
                className="items-center gap-2 mb-2"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FFE100] flex items-center justify-center text-[#0B3D6E] font-bold">
                  <span className="material-symbols-outlined text-[20px]">shield</span>
                </div>
                <span className="text-2xl font-bold text-[#0B3D6E] tracking-tight">IFDC.</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0B3D6E]/10 text-[#0B3D6E] rounded-full text-[11px] font-bold tracking-wider uppercase mb-2.5">
              <span className="material-symbols-outlined text-[13px]">person_add</span>
              <span>Admin Portal Registration</span>
            </div>

            <h1 className="font-['Manrope',sans-serif] text-2xl sm:text-[26px] font-extrabold text-[#0B3D6E] mb-1">
              Register Administrator
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed max-w-md">
              Create an authorized administrative profile to access security controls, volunteer registries, and global child welfare operations.
            </p>
          </div>

          {/* Success State */}
          {isRegisteredSuccess ? (
            <div className="text-center flex flex-col items-center gap-3.5 py-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 text-[#008575] flex items-center justify-center animate-bounce">
                <span className="material-symbols-outlined text-[36px]">verified_user</span>
              </div>
              <h3 className="text-lg font-bold text-[#0B3D6E]">Admin Profile Created</h3>
              <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
                Your credentials have been securely stored in the system registry. Redirecting you to the sign-in portal...
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#008575] mt-1">
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                <span>Proceeding to Login...</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="mt-2 px-6 py-2.5 rounded-lg bg-[#FFE100] text-[#001228] font-['Manrope',sans-serif] text-xs font-bold shadow-md hover:brightness-105 transition-all cursor-pointer"
              >
                Sign In Immediately
              </button>
            </div>
          ) : (
            /* Registration Form */
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-shake">
                  <span className="material-symbols-outlined text-[18px] text-red-600 shrink-0">error</span>
                  <span className="font-medium leading-tight">{errorMessage}</span>
                </div>
              )}

              {/* Full Name & Work Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label htmlFor="regFullName" className="text-xs font-bold text-slate-800">
                    Full Legal Name
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-slate-400 pointer-events-none text-[19px]">
                      badge
                    </span>
                    <input
                      id="regFullName"
                      type="text"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B3D6E] focus:ring-2 focus:ring-[#0B3D6E]/15 transition-all"
                      placeholder="Dr. Sarah Jenkins"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="regEmail" className="text-xs font-bold text-slate-800">
                    Institutional Email
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-slate-400 pointer-events-none text-[19px]">
                      mail
                    </span>
                    <input
                      id="regEmail"
                      type="email"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B3D6E] focus:ring-2 focus:ring-[#0B3D6E]/15 transition-all"
                      placeholder="s.jenkins@ifdchild.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Role & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label htmlFor="regRole" className="text-xs font-bold text-slate-800">
                    Administrative Tier
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-slate-400 pointer-events-none text-[19px]">
                      shield_person
                    </span>
                    <select
                      id="regRole"
                      className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-[13.5px] text-slate-900 focus:outline-none focus:border-[#0B3D6E] focus:ring-2 focus:ring-[#0B3D6E]/15 transition-all cursor-pointer appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:0.65rem]"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2374777F%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")`
                      }}
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="regDept" className="text-xs font-bold text-slate-800">
                    Department / Bureau
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-slate-400 pointer-events-none text-[19px]">
                      corporate_fare
                    </span>
                    <input
                      id="regDept"
                      type="text"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B3D6E] focus:ring-2 focus:ring-[#0B3D6E]/15 transition-all"
                      placeholder="Central Administration"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Clearance Key / Security Token */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="regClearance" className="text-xs font-bold text-slate-800">
                    Security Clearance Token / Invite Key
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">Optional for verified staff</span>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-slate-400 pointer-events-none text-[19px]">
                    vpn_key
                  </span>
                  <input
                    id="regClearance"
                    type="text"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B3D6E] focus:ring-2 focus:ring-[#0B3D6E]/15 transition-all font-mono"
                    placeholder="IFDC-AUTH-XXXX-2024"
                    value={clearanceKey}
                    onChange={(e) => setClearanceKey(e.target.value)}
                  />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label htmlFor="regPassword" className="text-xs font-bold text-slate-800">
                    Master Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-slate-400 pointer-events-none text-[19px]">
                      lock
                    </span>
                    <input
                      id="regPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="w-full pl-9 pr-10 py-2 bg-white border border-slate-300 rounded-lg text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B3D6E] focus:ring-2 focus:ring-[#0B3D6E]/15 transition-all"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-2 text-slate-400 hover:text-[#0B3D6E] p-1 rounded transition-colors cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="regConfirmPassword" className="text-xs font-bold text-slate-800">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-slate-400 pointer-events-none text-[19px]">
                      check_circle
                    </span>
                    <input
                      id="regConfirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      className={`w-full pl-9 pr-10 py-2 bg-white border rounded-lg text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                        confirmPassword
                          ? passwordsMatch
                            ? 'border-emerald-600 focus:border-emerald-600 focus:ring-emerald-500/20'
                            : 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50/20'
                          : 'border-slate-300 focus:border-[#0B3D6E] focus:ring-[#0B3D6E]/15'
                      }`}
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-2 text-slate-400 hover:text-[#0B3D6E] p-1 rounded transition-colors cursor-pointer"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Security Meter & Requirements */}
              {password.length > 0 && (
                <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600">
                    <span>Password Security Strength</span>
                    <span
                      className={
                        strengthScore <= 1
                          ? 'text-red-600'
                          : strengthScore <= 3
                          ? 'text-amber-600'
                          : 'text-teal-700'
                      }
                    >
                      {strengthScore <= 1 ? 'Weak' : strengthScore <= 3 ? 'Moderate' : 'Institutional Strong'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(strengthScore / 4) * 100}%`,
                        backgroundColor:
                          strengthScore <= 1 ? '#DC2626' : strengthScore <= 3 ? '#D97706' : '#0D9488',
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <div
                      className={`flex items-center gap-1 text-[11px] transition-colors ${
                        passwordCriteria.hasMinLength ? 'text-[#008575] font-semibold' : 'text-slate-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {passwordCriteria.hasMinLength ? 'check' : 'close'}
                      </span>
                      <span>8+ characters</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-[11px] transition-colors ${
                        passwordCriteria.hasNumber ? 'text-[#008575] font-semibold' : 'text-slate-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {passwordCriteria.hasNumber ? 'check' : 'close'}
                      </span>
                      <span>Includes a number</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-[11px] transition-colors ${
                        passwordCriteria.hasUpper ? 'text-[#008575] font-semibold' : 'text-slate-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {passwordCriteria.hasUpper ? 'check' : 'close'}
                      </span>
                      <span>Uppercase letter</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-[11px] transition-colors ${
                        passwordCriteria.hasSpecial ? 'text-[#008575] font-semibold' : 'text-slate-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {passwordCriteria.hasSpecial ? 'check' : 'close'}
                      </span>
                      <span>Special symbol</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Child Safety Data Compliance & NDA */}
              <label className="flex items-start gap-2.5 text-xs text-slate-600 leading-normal cursor-pointer select-none mt-1">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="accent-[#0B3D6E] w-4 h-4 mt-0.5 rounded cursor-pointer shrink-0"
                />
                <span>
                  I verify that I am an authorized IFDC officer and agree to uphold strict adherence to the{' '}
                  <strong className="text-[#0B3D6E]">IFDC Child Data Governance & Privacy Protection Protocols</strong>.
                </span>
              </label>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-5 rounded-lg bg-[#FFE100] text-[#001228] font-['Manrope',sans-serif] text-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(255,225,0,0.35)] hover:brightness-105 hover:shadow-[0_6px_18px_rgba(255,225,0,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none transition-all duration-150 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                    <span>Provisioning Admin Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Admin Account</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>

              {/* Link to Login */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 pt-1">
                <span>Already have administrative credentials?</span>
                <Link to="/login" className="text-[#0B3D6E] font-bold hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Trust & Security Footer */}
        <footer className="w-full flex flex-col items-center text-center gap-2.5 mt-7 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#008575]">
            <span className="material-symbols-outlined text-[16px]">lock_clock</span>
            <span>Secure 256-bit SSL Encrypted Administrative Provisioning</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <a href="#security" onClick={(e) => e.preventDefault()} className="hover:text-[#0B3D6E] transition-colors">
              Security Policy
            </a>
            <span>•</span>
            <a href="#helpdesk" onClick={(e) => e.preventDefault()} className="hover:text-[#0B3D6E] transition-colors">
              IT Helpdesk Support
            </a>
            <span>•</span>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-[#0B3D6E] transition-colors">
              Terms of Access
            </a>
          </div>

          <p className="font-mono text-[11px] text-slate-400">
            © 2024 International Foundation for Digital Child (IFDC). All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Register;
