import React, { useState } from 'react';
import './screens.css';

const partners = [
  { id: 1, name: 'TechCorp Global', since: 'Since 2022', type: 'Corporate', typeColor: 'badge-tertiary', contact: 'Sarah Jenkins', email: 'sarah@techcorp.com', status: 'Active', statusColor: 'badge-active', icon: 'business' },
  { id: 2, name: 'EduFoundation', since: 'Since 2023', type: 'NGO', typeColor: 'badge-ngo', contact: 'Michael Chang', email: 'm.chang@edufound.org', status: 'Active', statusColor: 'badge-active', icon: 'volunteer_activism' },
  { id: 3, name: 'Global Connect', since: 'New Application', type: 'Corporate', typeColor: 'badge-tertiary', contact: 'Elena Rodriguez', email: 'elena@gconnect.net', status: 'Pending', statusColor: 'badge-pending', icon: 'public' },
  { id: 4, name: 'SafeNet NGO', since: 'Since 2021', type: 'NGO', typeColor: 'badge-ngo', contact: 'James Patel', email: 'j.patel@safenet.org', status: 'Active', statusColor: 'badge-active', icon: 'shield' },
];

const ManagePartners = () => {
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = partners.filter(p =>
    (!typeFilter || p.type === typeFilter) &&
    (!statusFilter || p.status === statusFilter)
  );

  return (
    <div className="screen-container">
      <div className="screen-header">
        <div>
          <h1 className="screen-title">Strategic Partnerships</h1>
          <p className="screen-subtitle">Manage corporate and NGO partner relationships.</p>
        </div>
        <button className="btn btn-primary">
          <span className="material-symbols-outlined">add</span>
          Add New Partner
        </button>
      </div>

      {/* Stats Bento Grid */}
      <div className="bento-grid-3">
        <div className="glass-card stat-bento animate-float">
          <div className="bento-header">
            <span className="bento-label">Total Partners</span>
            <div className="bento-icon primary"><span className="material-symbols-outlined">handshake</span></div>
          </div>
          <div className="bento-value">42</div>
          <div className="bento-trend positive"><span className="material-symbols-outlined" style={{fontSize:'14px'}}>trending_up</span> +3 this month</div>
        </div>
        <div className="glass-card stat-bento animate-float" style={{animationDelay:'0.2s'}}>
          <div className="bento-header">
            <span className="bento-label">Active Campaigns</span>
            <div className="bento-icon secondary"><span className="material-symbols-outlined">campaign</span></div>
          </div>
          <div className="bento-value">12</div>
          <div className="bento-trend neutral">Across 8 regions</div>
        </div>
        <div className="glass-card stat-bento animate-float" style={{animationDelay:'0.4s'}}>
          <div className="bento-header">
            <span className="bento-label">Pending Approvals</span>
            <div className="bento-icon error"><span className="material-symbols-outlined">pending_actions</span></div>
          </div>
          <div className="bento-value">5</div>
          <div className="bento-trend negative">Requires immediate attention</div>
        </div>
      </div>

      {/* Partner Directory Table */}
      <div className="glass-card table-card">
        <div className="table-header">
          <h2 className="table-title">Partner Directory</h2>
          <div className="table-filters">
            <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              <option value="Corporate">Corporate</option>
              <option value="NGO">NGO</option>
            </select>
            <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Type</th>
                <th>Primary Contact</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(partner => (
                <tr key={partner.id} className="table-row">
                  <td>
                    <div className="entity-cell">
                      <div className="entity-icon primary">
                        <span className="material-symbols-outlined">{partner.icon}</span>
                      </div>
                      <div>
                        <div className="entity-name">{partner.name}</div>
                        <div className="entity-sub">{partner.since}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge ${partner.typeColor}`}>{partner.type}</span></td>
                  <td>
                    <div className="entity-name">{partner.contact}</div>
                    <div className="entity-sub">{partner.email}</div>
                  </td>
                  <td>
                    <span className={`badge ${partner.statusColor}`}>
                      <span className="badge-dot"></span>
                      {partner.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button className="icon-action"><span className="material-symbols-outlined">edit</span></button>
                    <button className="icon-action"><span className="material-symbols-outlined">more_vert</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>Showing 1 to {filtered.length} of 42 entries</span>
          <div className="pagination">
            <button className="page-btn" disabled>Prev</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePartners;
