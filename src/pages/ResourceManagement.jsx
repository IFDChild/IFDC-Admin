import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AUDIENCES,
  createResource,
  deleteResource,
  fileUrl,
  formatBytes,
  getResources,
  updateResource,
  uploadResourceFile
} from '../services/resourceService';
import './ResourceManagement.css';

const EMPTY_FORM = {
  title: '',
  description: '',
  audience: AUDIENCES[0],
  category: '',
  status: 'published'
};

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function ResourceManagement() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [activeAudience, setActiveAudience] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      setResources(await getResources());
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

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return resources.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query) ||
        (item.category || '').toLowerCase().includes(query);

      const matchesAudience =
        activeAudience === 'All' || item.audience === activeAudience;

      return matchesSearch && matchesAudience;
    });
  }, [resources, searchQuery, activeAudience]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEdit = (resource) => {
    setEditingId(resource.id);
    setForm({
      title: resource.title,
      description: resource.description || '',
      audience: resource.audience,
      category: resource.category || '',
      status: resource.status
    });
    setFile(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    if (!editingId && !file) {
      setFormError('Please choose a PDF to upload.');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      let fileFields = {};

      if (file) {
        const uploaded = await uploadResourceFile(file);
        fileFields = {
          file_url: uploaded.url,
          file_name: uploaded.original_name || uploaded.filename,
          file_size: uploaded.size
        };
      }

      const payload = {
        title: form.title,
        description: form.description || null,
        audience: form.audience,
        category: form.category || null,
        status: form.status,
        ...fileFields
      };

      if (editingId) {
        await updateResource(editingId, payload);
        showToast(`"${form.title}" updated.`);
      } else {
        await createResource(payload);
        showToast(`"${form.title}" published to the website.`);
      }

      setIsModalOpen(false);
      await load();
    } catch (err) {
      setFormError(
        err instanceof TypeError
          ? 'Could not reach the server. Is the API running?'
          : err.message
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (resource) => {
    if (!window.confirm(`Remove "${resource.title}"? This cannot be undone.`)) return;

    try {
      await deleteResource(resource.id);
      showToast(`"${resource.title}" removed.`);
      await load();
    } catch (err) {
      showToast(err.message);
    }
  };

  const toggleStatus = async (resource) => {
    const next = resource.status === 'published' ? 'draft' : 'published';

    try {
      await updateResource(resource.id, { status: next });
      showToast(
        next === 'published'
          ? `"${resource.title}" is now live on the website.`
          : `"${resource.title}" hidden from the website.`
      );
      await load();
    } catch (err) {
      showToast(err.message);
    }
  };

  const publishedCount = resources.filter((r) => r.status === 'published').length;
  const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);

  return (
    <div className="rm-container">

      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 200,
          background: 'var(--primary)', color: '#fff', padding: '12px 20px',
          borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', fontWeight: 600
        }}>
          {toastMessage}
        </div>
      )}

      <div className="rm-header">
        <div>
          <h1 className="rm-title">Resource Management</h1>
          <p className="rm-subtitle">
            Upload a PDF and it appears in the website&apos;s resource library straight away.
          </p>
        </div>
        <div className="rm-header-actions">
          <button type="button" className="rm-btn-secondary" onClick={load} disabled={isLoading}>
            <span className="material-symbols-outlined">refresh</span>
            Refresh
          </button>
          <button type="button" className="rm-btn-primary" onClick={openCreate}>
            <span className="material-symbols-outlined">upload_file</span>
            Add Resource
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="rm-kpi-grid">
        <div className="rm-kpi-card">
          <div className="rm-kpi-top"><span className="rm-kpi-label">Total Resources</span></div>
          <div className="rm-kpi-value">{isLoading ? '—' : resources.length}</div>
          <div className="rm-kpi-note">Across all audiences</div>
        </div>
        <div className="rm-kpi-card">
          <div className="rm-kpi-top"><span className="rm-kpi-label">Live on Website</span></div>
          <div className="rm-kpi-value">{isLoading ? '—' : publishedCount}</div>
          <div className="rm-kpi-note">{isLoading ? '' : `${resources.length - publishedCount} draft`}</div>
        </div>
        <div className="rm-kpi-card">
          <div className="rm-kpi-top"><span className="rm-kpi-label">Downloads</span></div>
          <div className="rm-kpi-value">{isLoading ? '—' : totalDownloads.toLocaleString()}</div>
          <div className="rm-kpi-note">Since launch</div>
        </div>
      </div>

      {/* Controls */}
      <div className="rm-controls-card">
        <div className="rm-controls-row">
          <div className="rm-search-box">
            <span className="material-symbols-outlined rm-search-icon">search</span>
            <input
              className="rm-search-input"
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rm-audience-pills">
          {['All', ...AUDIENCES].map((name) => (
            <button
              key={name}
              type="button"
              className={`rm-pill ${activeAudience === name ? 'active' : ''}`}
              onClick={() => setActiveAudience(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div role="alert" style={{
          margin: '16px 0', padding: '12px 16px', borderRadius: 8,
          background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.25)',
          color: '#ba1a1a', display: 'flex', alignItems: 'center', gap: 8
        }}>
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rm-table-card">
        <div className="rm-table-wrapper">
          <table className="rm-table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Audience</th>
                <th>Size</th>
                <th>Added</th>
                <th>Downloads</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>Loading resources…</td></tr>
              )}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>
                    {resources.length === 0
                      ? 'No resources yet — use “Add Resource” to upload your first PDF.'
                      : 'No resources match your filters.'}
                  </td>
                </tr>
              )}

              {!isLoading && filtered.map((resource) => (
                <tr key={resource.id}>
                  <td>
                    <div className="rm-item-title-cell">
                      <div className="rm-item-icon pdf">
                        <span className="material-symbols-outlined">picture_as_pdf</span>
                      </div>
                      <div>
                        <div className="rm-item-name">{resource.title}</div>
                        <div className="rm-item-meta">{resource.category || 'Uncategorised'}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="rm-audience-label">{resource.audience}</span></td>
                  <td>{formatBytes(resource.file_size)}</td>
                  <td className="rm-date-cell">{formatDate(resource.created_at)}</td>
                  <td className="rm-downloads-cell"><span className="rm-downloads-num">{resource.downloads ?? 0}</span></td>
                  <td>
                    <span className={`rm-status-badge ${resource.status === 'published' ? 'published' : 'draft'}`}>
                      {resource.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="rm-actions-cell" style={{ textAlign: 'right' }}>
                    <a
                      className="rm-action-btn"
                      href={fileUrl(resource.file_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open PDF"
                    >
                      <span className="material-symbols-outlined">visibility</span>
                    </a>
                    <button
                      type="button"
                      className="rm-action-btn"
                      onClick={() => toggleStatus(resource)}
                      title={resource.status === 'published' ? 'Hide from website' : 'Publish to website'}
                    >
                      <span className="material-symbols-outlined">
                        {resource.status === 'published' ? 'visibility_off' : 'publish'}
                      </span>
                    </button>
                    <button type="button" className="rm-action-btn" onClick={() => openEdit(resource)} title="Edit">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button type="button" className="rm-action-btn" onClick={() => handleDelete(resource)} title="Delete">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / edit modal */}
      {isModalOpen && (
        <div className="rm-modal-backdrop" onClick={() => !isSaving && setIsModalOpen(false)}>
          <div className="rm-modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSave}>
              <div className="rm-modal-header">
                <div className="rm-modal-title-group">
                  <h2>{editingId ? 'Edit Resource' : 'Add Resource'}</h2>
                  <p>{editingId ? 'Update the details, or replace the PDF.' : 'Upload a PDF and publish it to the website.'}</p>
                </div>
                <button
                  type="button"
                  className="rm-modal-close-btn"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="rm-modal-body">
                <div className="rm-modal-field">
                  <label htmlFor="res-title">Title *</label>
                  <input
                    id="res-title"
                    className="rm-modal-input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    disabled={isSaving}
                    placeholder="Guidelines on Rights-Based Media Coverage"
                  />
                </div>

                <div className="rm-modal-field">
                  <label htmlFor="res-desc">Description</label>
                  <textarea
                    id="res-desc"
                    className="rm-modal-input"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    disabled={isSaving}
                    placeholder="Shown under the title on the website."
                  />
                </div>

                <div className="rm-modal-field">
                  <label htmlFor="res-audience">Audience *</label>
                  <select
                    id="res-audience"
                    className="rm-modal-input"
                    value={form.audience}
                    onChange={(e) => setForm({ ...form, audience: e.target.value })}
                    disabled={isSaving}
                  >
                    {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <div className="rm-modal-field">
                  <label htmlFor="res-category">Category</label>
                  <input
                    id="res-category"
                    className="rm-modal-input"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    disabled={isSaving}
                    placeholder="e.g. Media Guidelines"
                  />
                </div>

                <div className="rm-modal-field">
                  <label htmlFor="res-file">
                    PDF {editingId ? '(leave empty to keep the current file)' : '*'}
                  </label>
                  <input
                    id="res-file"
                    className="rm-modal-input"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    disabled={isSaving}
                  />
                  {file && (
                    <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginTop: 6 }}>
                      {file.name} — {formatBytes(file.size)}
                    </p>
                  )}
                  <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 6 }}>
                    Maximum 30 MB.
                  </p>
                </div>

                <div className="rm-modal-field">
                  <label htmlFor="res-status">Status</label>
                  <select
                    id="res-status"
                    className="rm-modal-input"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    disabled={isSaving}
                  >
                    <option value="published">Published — visible on the website</option>
                    <option value="draft">Draft — hidden from the website</option>
                  </select>
                </div>

                {formError && (
                  <div role="alert" style={{
                    padding: '12px 16px', borderRadius: 8,
                    background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.25)',
                    color: '#ba1a1a', fontSize: 14
                  }}>
                    {formError}
                  </div>
                )}
              </div>

              <div className="rm-modal-footer">
                <button
                  type="button"
                  className="rm-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button type="submit" className="rm-btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving…' : editingId ? 'Save changes' : 'Upload & publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
