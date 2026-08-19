import React from 'react';
import './screens.css';

const Overview = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">Here's what's happening at IFDC today.</p>
        </div>
        <div className="text-right">
          <p className="page-date">Oct 24, 2024</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-bg-blob primary"></div>
          <div className="stat-content">
            <div className="stat-header">
              <span className="stat-label">Total Blogs</span>
              <div className="stat-icon primary">
                <span className="material-symbols-outlined">article</span>
              </div>
            </div>
            <div className="stat-value">24</div>
            <div className="stat-caption primary">+3 this week</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-bg-blob secondary"></div>
          <div className="stat-content">
            <div className="stat-header">
              <span className="stat-label">Pending Volunteers</span>
              <div className="stat-icon secondary">
                <span className="material-symbols-outlined">group_add</span>
              </div>
            </div>
            <div className="stat-value">12</div>
            <div className="stat-caption error">
              <span className="material-symbols-outlined" style={{fontSize: '14px'}}>warning</span> Action needed
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-bg-blob tertiary"></div>
          <div className="stat-content">
            <div className="stat-header">
              <span className="stat-label">Active Partners</span>
              <div className="stat-icon tertiary">
                <span className="material-symbols-outlined">handshake</span>
              </div>
            </div>
            <div className="stat-value">8</div>
            <div className="stat-caption outline">Stable across all regions</div>
          </div>
        </div>

        <div className="stat-card dark">
          <div className="stat-bg-blob dark"></div>
          <div className="stat-content">
            <div className="stat-header">
              <span className="stat-label">Total Reach</span>
              <div className="stat-icon dark">
                <span className="material-symbols-outlined">public</span>
              </div>
            </div>
            <div className="stat-value">2.4M</div>
            <div className="stat-caption inverse">+12% from last quarter</div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="card">
          <div style={{padding: '1.5rem'}}>
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon-container primary">
                  <span className="material-symbols-outlined">edit_document</span>
                </div>
                <div className="activity-text">
                  <p className="activity-title">New blog post <strong>"Digital Safety in 2024"</strong> published.</p>
                  <p className="activity-time">2 hours ago • by Sarah J.</p>
                </div>
              </div>
              <div className="divider"></div>
              <div className="activity-item">
                <div className="activity-icon-container secondary">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div className="activity-text">
                  <p className="activity-title">Volunteer application for <strong>Michael Chen</strong> approved.</p>
                  <p className="activity-time">5 hours ago • System</p>
                </div>
              </div>
              <div className="divider"></div>
              <div className="activity-item">
                <div className="activity-icon-container neutral">
                  <span className="material-symbols-outlined">settings_backup_restore</span>
                </div>
                <div className="activity-text">
                  <p className="activity-title">System backup completed successfully.</p>
                  <p className="activity-time">Yesterday • Automated</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shortcuts-card">
          <h2 className="section-title" style={{marginBottom: '0'}}>Management Shortcuts</h2>
          <button className="btn btn-primary">
            <span className="material-symbols-outlined">add_circle</span>
            Create Blog Post
          </button>
          <button className="btn btn-secondary">
            <span className="material-symbols-outlined">how_to_reg</span>
            Verify Volunteer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
