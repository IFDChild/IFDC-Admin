import React, { useEffect, useState } from 'react';
import './screens.css';
import {
  changePassword,
  createTeamMember,
  deleteTeamMember,
  fetchCurrentUser,
  listTeam,
  updateProfile,
  updateTeamMember,
} from '../services/authService';
import { getDonationEmailStatus } from '../services/donationService';
import { initialsFor } from '../hooks/useSessionUser';

const ROLES = ['System Administrator', 'Editor', 'Moderator'];

const formatDateTime = (value) => {
  if (!value) return 'Never';
  const date = new Date(/[zZ]|[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`);
  if (Number.isNaN(date.getTime())) return 'Never';
  return date.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
};

const relativeDate = (value) => {
  if (!value) return 'Never signed in';
  const date = new Date(/[zZ]|[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`);
  if (Number.isNaN(date.getTime())) return 'Never signed in';

  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)} hours ago`;
  return `${Math.round(minutes / (60 * 24))} days ago`;
};

const Settings = () => {
  const [me, setMe] = useState(null);
  const [team, setTeam] = useState([]);
  const [emailConfigured, setEmailConfigured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Profile
  const [fullName, setFullName] = useState('');
  const [profileState, setProfileState] = useState({ busy: false, message: '', error: '' });

  // Password
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [passwordState, setPasswordState] = useState({ busy: false, message: '', error: '' });

  // New team member
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState({ full_name: '', email: '', role: 'Editor', password: '' });
  const [addState, setAddState] = useState({ busy: false, error: '' });
  const [rowBusyId, setRowBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchCurrentUser(), listTeam(), getDonationEmailStatus().catch(() => null)])
      .then(([user, members, email]) => {
        if (cancelled) return;
        setMe(user);
        setFullName(user.full_name || '');
        setTeam(members);
        setEmailConfigured(email?.configured ?? null);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || 'Could not load settings');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const refreshTeam = () => listTeam().then(setTeam).catch(() => {});

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileState({ busy: true, message: '', error: '' });

    try {
      const updated = await updateProfile(fullName.trim());
      setMe(updated);
      setProfileState({ busy: false, message: 'Profile saved', error: '' });
      refreshTeam();
    } catch (err) {
      setProfileState({ busy: false, message: '', error: err.message });
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();

    if (passwords.next !== passwords.confirm) {
      setPasswordState({ busy: false, message: '', error: 'The new passwords do not match' });
      return;
    }

    setPasswordState({ busy: true, message: '', error: '' });

    try {
      await changePassword(passwords.current, passwords.next);
      setPasswords({ current: '', next: '', confirm: '' });
      setPasswordState({ busy: false, message: 'Password changed', error: '' });
    } catch (err) {
      setPasswordState({ busy: false, message: '', error: err.message });
    }
  };

  const addMember = async (event) => {
    event.preventDefault();
    setAddState({ busy: true, error: '' });

    try {
      await createTeamMember({ ...newMember, full_name: newMember.full_name.trim(), email: newMember.email.trim() });
      setNewMember({ full_name: '', email: '', role: 'Editor', password: '' });
      setShowAdd(false);
      setAddState({ busy: false, error: '' });
      refreshTeam();
    } catch (err) {
      setAddState({ busy: false, error: err.message });
    }
  };

  const toggleActive = async (member) => {
    setRowBusyId(member.id);
    try {
      await updateTeamMember(member.id, { is_active: !member.is_active });
      await refreshTeam();
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setRowBusyId(null);
    }
  };

  const changeRole = async (member, role) => {
    setRowBusyId(member.id);
    try {
      await updateTeamMember(member.id, { role });
      await refreshTeam();
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setRowBusyId(null);
    }
  };

  const removeMember = async (member) => {
    if (!window.confirm(`Remove ${member.full_name || member.email}? They will lose access immediately.`)) return;

    setRowBusyId(member.id);
    try {
      await deleteTeamMember(member.id);
      await refreshTeam();
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setRowBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="screen-container">
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Settings</h1>
        <p className="screen-subtitle">Loading your account…</p>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Settings</h1>
        <p className="screen-subtitle">Your account, the people who can sign in, and how notifications are sent.</p>
      </div>

      {loadError && <div className="form-error" role="alert">{loadError}</div>}

      <div className="settings-grid">
        {/* Profile */}
        <div className="card settings-card col-span-2">
          <div className="settings-section-header">
            <span className="material-symbols-outlined" style={{ color: 'var(--deep-navy)' }}>account_circle</span>
            <h2 className="settings-section-title">Your profile</h2>
          </div>

          <div className="settings-identity">
            <div className="avatar-initials avatar-lg" style={{ background: 'var(--primary-fixed)', color: 'var(--primary)' }}>
              {initialsFor(me)}
            </div>
            <div>
              <div className="entity-name">{me?.full_name || me?.email}</div>
              <div className="entity-sub">{me?.email}</div>
              <div className="entity-sub">{me?.role} · last signed in {relativeDate(me?.last_login_at)}</div>
            </div>
          </div>

          <form onSubmit={saveProfile}>
            <div className="form-grid-2">
              <div className="form-field">
                <label htmlFor="full-name">Display name</label>
                <input
                  id="full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  minLength={2}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="account-email">Sign-in email</label>
                <input id="account-email" type="email" value={me?.email || ''} readOnly disabled />
              </div>
            </div>

            {profileState.error && <div className="form-error" role="alert">{profileState.error}</div>}
            {profileState.message && <div className="form-success" role="status">{profileState.message}</div>}

            <div className="settings-actions">
              <button type="submit" className="btn btn-save" disabled={profileState.busy || !fullName.trim()}>
                <span className="material-symbols-outlined">save</span>
                {profileState.busy ? 'Saving…' : 'Save profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Password */}
        <div className="card settings-card">
          <div className="settings-section-header">
            <span className="material-symbols-outlined" style={{ color: 'var(--deep-navy)' }}>lock</span>
            <h2 className="settings-section-title">Password</h2>
          </div>
          <p className="settings-desc">At least 10 characters, mixing three of: lowercase, uppercase, numbers, symbols.</p>

          <form onSubmit={savePassword}>
            <div className="form-field">
              <label htmlFor="current-password">Current password</label>
              <input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="new-password">New password</label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={passwords.next}
                onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                minLength={10}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="confirm-password">Confirm new password</label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                minLength={10}
                required
              />
            </div>

            {passwordState.error && <div className="form-error" role="alert">{passwordState.error}</div>}
            {passwordState.message && <div className="form-success" role="status">{passwordState.message}</div>}

            <div className="settings-actions">
              <button type="submit" className="btn btn-save" disabled={passwordState.busy}>
                <span className="material-symbols-outlined">key</span>
                {passwordState.busy ? 'Changing…' : 'Change password'}
              </button>
            </div>
          </form>
        </div>

        {/* Team */}
        <div className="card settings-card col-span-3 no-pad">
          <div className="table-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--deep-navy)' }}>manage_accounts</span>
              <div>
                <h2 className="table-title">Dashboard access</h2>
                <p style={{ fontSize: '13px', color: 'var(--on-surface-variant)', marginTop: '2px' }}>
                  {team.length} {team.length === 1 ? 'account' : 'accounts'} · {team.filter((m) => m.is_active).length} active
                </p>
              </div>
            </div>
            <button type="button" className="btn btn-navy-sm" onClick={() => setShowAdd((open) => !open)}>
              <span className="material-symbols-outlined">{showAdd ? 'close' : 'add'}</span>
              {showAdd ? 'Cancel' : 'Add user'}
            </button>
          </div>

          {showAdd && (
            <form className="settings-add-form" onSubmit={addMember}>
              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="new-name">Full name</label>
                  <input
                    id="new-name"
                    type="text"
                    value={newMember.full_name}
                    onChange={(e) => setNewMember({ ...newMember, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="new-email">Email</label>
                  <input
                    id="new-email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="new-role">Role</label>
                  <select
                    id="new-role"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  >
                    {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="new-user-password">Temporary password</label>
                  <input
                    id="new-user-password"
                    type="text"
                    value={newMember.password}
                    onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                    minLength={10}
                    required
                  />
                </div>
              </div>

              <p className="settings-desc">Share this password with them privately. They can change it here after signing in.</p>
              {addState.error && <div className="form-error" role="alert">{addState.error}</div>}

              <div className="settings-actions">
                <button type="submit" className="btn btn-save" disabled={addState.busy}>
                  <span className="material-symbols-outlined">person_add</span>
                  {addState.busy ? 'Adding…' : 'Add user'}
                </button>
              </div>
            </form>
          )}

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Last active</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.map((member) => {
                  const isMe = member.id === me?.id;
                  return (
                    <tr key={member.id} className="table-row" style={{ opacity: rowBusyId === member.id ? 0.55 : 1 }}>
                      <td>
                        <div className="entity-cell">
                          <div className="avatar-initials" style={{ background: 'var(--primary-fixed)', color: 'var(--primary)' }}>
                            {initialsFor(member)}
                          </div>
                          <div>
                            <div className="entity-name">
                              {member.full_name || member.email}
                              {isMe && <span className="badge badge-neutral" style={{ marginLeft: '0.5rem' }}>You</span>}
                            </div>
                            <div className="entity-sub">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <select
                          className="rm-select settings-role-select"
                          value={ROLES.includes(member.role) ? member.role : ROLES[0]}
                          onChange={(e) => changeRole(member, e.target.value)}
                          disabled={rowBusyId === member.id}
                          aria-label={`Role for ${member.full_name || member.email}`}
                        >
                          {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                        </select>
                      </td>
                      <td className="td-muted" title={formatDateTime(member.last_login_at)}>
                        {relativeDate(member.last_login_at)}
                      </td>
                      <td>
                        <span className={`badge ${member.is_active ? 'badge-success' : 'badge-warning'}`}>
                          {member.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          className="icon-action"
                          onClick={() => toggleActive(member)}
                          disabled={isMe || rowBusyId === member.id}
                          title={isMe ? 'You cannot disable your own account' : member.is_active ? 'Disable access' : 'Restore access'}
                        >
                          <span className="material-symbols-outlined">{member.is_active ? 'block' : 'check_circle'}</span>
                        </button>
                        <button
                          type="button"
                          className="icon-action danger"
                          onClick={() => removeMember(member)}
                          disabled={isMe || rowBusyId === member.id}
                          title={isMe ? 'You cannot remove your own account' : 'Remove user'}
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
        <div className="card settings-card col-span-3">
          <div className="settings-section-header">
            <span className="material-symbols-outlined" style={{ color: 'var(--deep-navy)' }}>mail</span>
            <h2 className="settings-section-title">Email notifications</h2>
          </div>

          <div className="settings-status-row">
            <span className={`badge ${emailConfigured ? 'badge-success' : 'badge-warning'}`}>
              {emailConfigured === null ? 'Unknown' : emailConfigured ? 'Configured' : 'Not configured'}
            </span>
            <p className="settings-desc" style={{ margin: 0 }}>
              {emailConfigured
                ? 'Donation requests are emailed to the notification address as they arrive.'
                : 'Donation requests are saved and listed under Donation Requests, but no email is sent until the mail settings are filled in on the server.'}
            </p>
          </div>

          <p className="settings-desc">
            Mail delivery is configured on the server through the SMTP_HOST, SMTP_USER, SMTP_PASSWORD and
            ADMIN_NOTIFY_EMAIL settings, so credentials are never stored in the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
