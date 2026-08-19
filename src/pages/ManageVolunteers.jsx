import React, { useState } from 'react';
import './screens.css';

const volunteers = [
  { id: 1, initials: 'ES', name: 'Elena Silva', bgColor: '#fee000', fgColor: '#514700', expertise: 'Education & Tutoring', date: 'Oct 24, 2023', status: 'Pending', statusClass: 'badge-warning' },
  { id: 2, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmxOFSGJQ70T8XjLsSiwQtTRDb4ixCRyeZWKr7jvBukX8S8dJMLQiF1FI3AfGOhwnAPHFPa5ndkYh6aGvKHEMictlexWqmBAQM5jL2gllqO9unCS_NuQsTiYVgNF7tRUAKKaShTshaKX3BVpstxxynCWVQVRge98uQuf-6iICAchaphIB_Of9BRj-DLAmpo6NcSy7BljD_T7TN5HbWYg6ga45rCKNT2m4-y0FcqFaOt4zgBQCe98so', name: 'Marcus Johnson', expertise: 'Event Logistics', date: 'Oct 23, 2023', status: 'Verified', statusClass: 'badge-success' },
  { id: 3, initials: 'AK', name: 'Aisha Khan', bgColor: '#0b3d6e', fgColor: '#ffffff', expertise: 'Medical Assistance', date: 'Oct 21, 2023', status: 'Pending', statusClass: 'badge-warning' },
  { id: 4, initials: 'DP', name: 'David Park', bgColor: '#e0e3e5', fgColor: '#43474f', expertise: 'IT Support', date: 'Oct 20, 2023', status: 'Rejected', statusClass: 'badge-error' },
  { id: 5, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcrNpGsmRHYsVQ8_p0HsqKNI0irZp9DRXmBq4H_htri2ostctbzHvjs5204JtZYoVjWWUYK5SkqFnsjyyRcqKsllZfwzORmZJkNU_IhgCEFckxN7n2Wy7q47QfpqMVjI1v2EBK3rCJqZKtMv4tGno5xTHLBW6tpJJtjcWuVjHu9N1OgB7jicTIHfyzqEoatjC6fG_krt8iE22Z75VKMCqXhWOnbjzQ52zeOw_QqgQTEzDMdykqXxTz', name: 'Sarah Jenkins', expertise: 'Counseling', date: 'Oct 19, 2023', status: 'Verified', statusClass: 'badge-success' },
];

const ManageVolunteers = () => {
  const [search, setSearch] = useState('');

  const filtered = volunteers.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="screen-container">
      <div className="screen-header">
        <div>
          <h1 className="screen-title">Volunteers</h1>
          <p className="screen-subtitle">Review and manage incoming volunteer applications.</p>
        </div>
        <div style={{display:'flex', gap:'0.75rem'}}>
          <button className="btn btn-secondary">
            <span className="material-symbols-outlined">filter_list</span>
            Filter
          </button>
          <button className="btn btn-navy">
            <span className="material-symbols-outlined">download</span>
            Export List
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="bento-grid-3">
        <div className="card stat-bento">
          <div className="bento-header">
            <span className="bento-label">Total Pending</span>
            <div className="bento-icon warning"><span className="material-symbols-outlined">hourglass_empty</span></div>
          </div>
          <div className="bento-value">142</div>
          <div className="bento-trend neutral">Awaiting review</div>
        </div>
        <div className="card stat-bento">
          <div className="bento-header">
            <span className="bento-label">Verified This Month</span>
            <div className="bento-icon success"><span className="material-symbols-outlined">check_circle</span></div>
          </div>
          <div className="bento-value">87</div>
          <div className="bento-trend positive"><span style={{color:'#008575',fontWeight:600}}>+12%</span> vs last month</div>
        </div>
        <div className="card stat-bento">
          <div className="bento-header">
            <span className="bento-label">Total Active Volunteers</span>
            <div className="bento-icon primary"><span className="material-symbols-outlined">groups</span></div>
          </div>
          <div className="bento-value">1,204</div>
          <div className="bento-trend neutral">Across all regions</div>
        </div>
      </div>

      {/* Table */}
      <div className="card table-card">
        <div className="table-header">
          <h2 className="table-title">Recent Applications</h2>
          <div className="search-field">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Search applicants..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{width:'33%'}}>Name</th>
                <th>Area of Expertise</th>
                <th>Application Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} className="table-row">
                  <td>
                    <div className="entity-cell">
                      {v.avatar ? (
                        <img src={v.avatar} alt={v.name} className="avatar-img" />
                      ) : (
                        <div className="avatar-initials" style={{background: v.bgColor, color: v.fgColor}}>{v.initials}</div>
                      )}
                      <div className="entity-name" style={{fontWeight:600}}>{v.name}</div>
                    </div>
                  </td>
                  <td className="td-muted">{v.expertise}</td>
                  <td className="td-mono">{v.date}</td>
                  <td><span className={`badge ${v.statusClass}`}>{v.status}</span></td>
                  <td className="text-right">
                    <button className="icon-action"><span className="material-symbols-outlined">more_vert</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>Showing 1 to {filtered.length} of 142 entries</span>
          <div className="pagination">
            <button className="page-btn" disabled>Previous</button>
            <button className="page-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageVolunteers;
