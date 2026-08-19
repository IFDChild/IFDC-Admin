import React, { useState } from 'react';
import './screens.css';

const users = [
  { id: 1, initials: 'EC', name: 'Elena Carter', email: 'elena@ifdc.org', role: 'Super Admin', lastActive: 'Just now', status: 'Active', statusClass: 'badge-success' },
  { id: 2, initials: 'MR', name: 'Marcus Reed', email: 'marcus@ifdc.org', role: 'Editor', lastActive: '2 hours ago', status: 'Active', statusClass: 'badge-success' },
  { id: 3, initials: 'SJ', name: 'Sarah Jenkins', email: 'sarah@ifdc.org', role: 'Moderator', lastActive: '5 days ago', status: 'Pending', statusClass: 'badge-warning' },
];

const Settings = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  return (
    <div className="screen-container">
      <h1 className="screen-title" style={{marginBottom: '0'}}>System Settings</h1>
      <p className="screen-subtitle" style={{marginBottom: '2rem'}}>Configure your admin portal preferences and manage users.</p>

      {/* Bento Grid */}
      <div className="settings-grid">
        {/* General Information */}
        <div className="card settings-card col-span-2">
          <div className="settings-section-header">
            <span className="material-symbols-outlined" style={{color: 'var(--deep-navy)'}}>domain</span>
            <h2 className="settings-section-title">General Information</h2>
          </div>
          <div className="form-grid-2">
            <div className="form-field">
              <label>Organization Name</label>
              <input type="text" defaultValue="International Foundation for Digital Children" />
            </div>
            <div className="form-field">
              <label>Primary Contact Email</label>
              <input type="email" defaultValue="admin@ifdc.org" />
            </div>
            <div className="form-field">
              <label>System Timezone</label>
              <select defaultValue="CET">
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="EST">EST (Eastern Standard Time)</option>
                <option value="CET">CET (Central European Time)</option>
              </select>
            </div>
            <div className="form-field">
              <label>Default Language</label>
              <select>
                <option>English (US)</option>
                <option>French (FR)</option>
                <option>Spanish (ES)</option>
              </select>
            </div>
          </div>
          <div className="form-field" style={{marginTop: '1.5rem'}}>
            <label>Support Portal URL</label>
            <div className="input-prefix-group">
              <span className="input-prefix">https://</span>
              <input type="text" defaultValue="support.ifdc.org" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card settings-card">
          <div className="settings-section-header">
            <span className="material-symbols-outlined" style={{color: 'var(--deep-navy)'}}>notifications_active</span>
            <h2 className="settings-section-title">Notifications</h2>
          </div>
          <p className="settings-desc">Configure global notification defaults for administrative users.</p>

          <div className="toggle-list">
            <div className="toggle-item">
              <div>
                <p className="toggle-label">Email Alerts</p>
                <p className="toggle-sublabel">Critical system updates</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={emailAlerts} onChange={e => setEmailAlerts(e.target.checked)} />
                <span className="toggle-track"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div>
                <p className="toggle-label">Push Notifications</p>
                <p className="toggle-sublabel">Browser notifications</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={pushNotifs} onChange={e => setPushNotifs(e.target.checked)} />
                <span className="toggle-track"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div>
                <p className="toggle-label">Weekly Digest</p>
                <p className="toggle-sublabel">Summary of activities</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={weeklyDigest} onChange={e => setWeeklyDigest(e.target.checked)} />
                <span className="toggle-track"></span>
              </label>
            </div>
          </div>
        </div>

        {/* User Management - Full Width */}
        <div className="card settings-card col-span-3 no-pad">
          <div className="table-header">
            <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
              <span className="material-symbols-outlined" style={{color: 'var(--deep-navy)'}}>manage_accounts</span>
              <div>
                <h2 className="table-title">User Management</h2>
                <p style={{fontSize:'13px', color:'var(--on-surface-variant)', marginTop:'2px'}}>Manage administrative access and roles.</p>
              </div>
            </div>
            <button className="btn btn-navy-sm">
              <span className="material-symbols-outlined">add</span>
              Add User
            </button>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Last Active</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="table-row">
                    <td>
                      <div className="entity-cell">
                        <div className="avatar-initials" style={{background: 'var(--primary-fixed)', color: 'var(--primary)'}}>{u.initials}</div>
                        <div>
                          <div className="entity-name">{u.name}</div>
                          <div className="entity-sub">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="td-mono">{u.role}</td>
                    <td className="td-muted">{u.lastActive}</td>
                    <td><span className={`badge ${u.statusClass}`}>{u.status}</span></td>
                    <td className="text-right">
                      <button className="icon-action"><span className="material-symbols-outlined">more_vert</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Save bar */}
      <div className="save-bar">
        <button className="btn btn-secondary">Cancel</button>
        <button className="btn btn-save">
          <span className="material-symbols-outlined">save</span>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
