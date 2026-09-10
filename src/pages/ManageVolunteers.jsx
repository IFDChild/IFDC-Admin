import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVolunteers, statusMeta } from '../services/volunteerService';
import './screens.css';

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'new', label: 'Pending' },
  { value: 'reviewing', label: 'In Review' },
  { value: 'accepted', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
];

const initials = (first, last) =>
  `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase();

const formatDate = (value) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
};

const ManageVolunteers = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      setApplications(await getVolunteers());
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'Could not reach the server. Is the API running?'
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const tally = { new: 0, reviewing: 0, accepted: 0, rejected: 0 };

    applications.forEach((item) => {
      if (tally[item.status] !== undefined) tally[item.status] += 1;
    });

    return tally;
  }, [applications]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return applications.filter((item) => {
      if (statusFilter && item.status !== statusFilter) return false;
      if (!term) return true;

      const haystack = [
        item.first_name,
        item.last_name,
        item.email,
        item.describes,
        ...(item.interests || [])
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [applications, search, statusFilter]);

  const openApplication = (id) => navigate(`/volunteers/review/${id}`);

  return (
    <div className="screen-container">
      <div className="screen-header">
        <div>
          <h1 className="screen-title">Volunteers</h1>
          <p className="screen-subtitle">Review and manage incoming volunteer applications.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={load} disabled={isLoading}>
            <span className="material-symbols-outlined">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="bento-grid-3">
        <div className="card stat-bento">
          <div className="bento-header">
            <span className="bento-label">Awaiting Review</span>
            <div className="bento-icon warning"><span className="material-symbols-outlined">hourglass_empty</span></div>
          </div>
          <div className="bento-value">{isLoading ? '—' : counts.new}</div>
          <div className="bento-trend neutral">New applications</div>
        </div>
        <div className="card stat-bento">
          <div className="bento-header">
            <span className="bento-label">Approved</span>
            <div className="bento-icon success"><span className="material-symbols-outlined">check_circle</span></div>
          </div>
          <div className="bento-value">{isLoading ? '—' : counts.accepted}</div>
          <div className="bento-trend neutral">Accepted volunteers</div>
        </div>
        <div className="card stat-bento">
          <div className="bento-header">
            <span className="bento-label">Total Applications</span>
            <div className="bento-icon primary"><span className="material-symbols-outlined">groups</span></div>
          </div>
          <div className="bento-value">{isLoading ? '—' : applications.length}</div>
          <div className="bento-trend neutral">
            {isLoading ? 'Loading…' : `${counts.reviewing} in review • ${counts.rejected} rejected`}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card table-card">
        <div className="table-header">
          <h2 className="table-title">Applications</h2>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {FILTERS.map((filter) => (
                <button
                  key={filter.value || 'all'}
                  onClick={() => setStatusFilter(filter.value)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: '1px solid var(--border-subtle)',
                    background: statusFilter === filter.value ? 'var(--primary)' : '#fff',
                    color: statusFilter === filter.value ? '#fff' : 'var(--on-surface-variant)'
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="search-field">
              <span className="material-symbols-outlined">search</span>
              <input
                type="text"
                placeholder="Search applicants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              margin: '16px 24px',
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(186,26,26,0.08)',
              border: '1px solid rgba(186,26,26,0.25)',
              color: '#ba1a1a',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Name</th>
                <th>Areas of Interest</th>
                <th>Applied</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--on-surface-variant)' }}>
                    Loading applications…
                  </td>
                </tr>
              )}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--on-surface-variant)' }}>
                    {applications.length === 0
                      ? 'No volunteer applications yet.'
                      : 'No applications match your filters.'}
                  </td>
                </tr>
              )}

              {!isLoading && filtered.map((item) => {
                const meta = statusMeta(item.status);

                return (
                  <tr
                    key={item.id}
                    className="table-row"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openApplication(item.id)}
                  >
                    <td>
                      <div className="entity-cell">
                        <div className="avatar-initials" style={{ background: '#0b3d6e', color: '#ffffff' }}>
                          {initials(item.first_name, item.last_name)}
                        </div>
                        <div>
                          <div className="entity-name" style={{ fontWeight: 600 }}>
                            {item.first_name} {item.last_name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="td-muted">
                      {(item.interests || []).slice(0, 2).join(', ')}
                      {(item.interests || []).length > 2 && ` +${item.interests.length - 2}`}
                    </td>
                    <td className="td-mono">{formatDate(item.created_at)}</td>
                    <td><span className={`badge ${meta.badge}`}>{meta.label}</span></td>
                    <td className="text-right">
                      <button
                        className="icon-action"
                        title="Review Application"
                        onClick={(e) => { e.stopPropagation(); openApplication(item.id); }}
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>
            {isLoading
              ? 'Loading…'
              : `Showing ${filtered.length} of ${applications.length} application${applications.length === 1 ? '' : 's'}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ManageVolunteers;
