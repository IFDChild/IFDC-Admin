import React, { useState, useMemo } from 'react';
import './ResourceManagement.css';

// Latest resources matching Stitch AI screen `Resource Management - IFDC Admin` (latest update)
const INITIAL_RESOURCES = [
  {
    id: 'res-1',
    title: '2024 Comprehensive Online Child Safety Guide',
    format: 'PDF',
    size: '4.2 MB',
    languages: ['EN', 'ES', 'FR'],
    audience: 'Parents & Caregivers',
    audienceIcon: 'family_restroom',
    category: 'Safety Guides',
    downloads: 24150,
    trendingTag: '#1 trending',
    lastUpdated: 'Oct 28, 2024',
    status: 'Published',
    iconType: 'pdf',
    iconName: 'picture_as_pdf'
  },
  {
    id: 'res-2',
    title: 'Cyber-Citizenship Curriculum (Grades 1-5)',
    format: 'PDF Package',
    size: '18.5 MB',
    languages: ['Teacher Kit Included'],
    audience: 'Educators & Schools',
    audienceIcon: 'school',
    category: 'Curriculum',
    downloads: 19840,
    lastUpdated: 'Oct 15, 2024',
    status: 'Published',
    iconType: 'zip',
    iconName: 'folder_zip'
  },
  {
    id: 'res-3',
    title: 'Social Media & Mental Health: Clinical Advisory',
    format: 'PDF',
    size: '2.8 MB',
    languages: ['Peer Reviewed'],
    audience: 'Parents & Educators',
    audienceIcon: 'diversity_3',
    category: 'Mental Health',
    downloads: 14200,
    lastUpdated: 'Sep 30, 2024',
    status: 'Published',
    iconType: 'pdf',
    iconName: 'picture_as_pdf'
  },
  {
    id: 'res-4',
    title: 'Gaming Safety & Age Verification Standards (Draft)',
    format: 'DOCX / PDF',
    size: '5.1 MB',
    languages: ['Under Legal Review'],
    audience: 'Policymakers',
    audienceIcon: 'policy',
    category: 'Policy & Standards',
    downloads: 0,
    lastUpdated: 'Nov 02, 2024',
    status: 'Draft',
    iconType: 'draft',
    iconName: 'draft'
  },
  {
    id: 'res-5',
    title: 'Digital Footprint Awareness Interactive Booklet',
    format: 'PDF',
    size: '8.4 MB',
    languages: ['Interactive Worksheet'],
    audience: 'Children & Youth',
    audienceIcon: 'smart_toy',
    category: 'Interactive Materials',
    downloads: 11350,
    lastUpdated: 'Aug 20, 2024',
    status: 'Published',
    iconType: 'interactive',
    iconName: 'auto_stories'
  },
  {
    id: 'res-6',
    title: 'AI & Child Privacy: Global Regulatory Analysis 2025',
    format: 'PDF',
    size: '12.1 MB',
    languages: ['Dataset Appended'],
    audience: 'Policymakers & Research',
    audienceIcon: 'gavel',
    category: 'Research Report',
    downloads: 8760,
    lastUpdated: 'Oct 04, 2024',
    status: 'Published',
    iconType: 'pdf',
    iconName: 'analytics'
  },
  {
    id: 'res-7',
    title: 'SafeClick Browser Extension Setup Manual',
    format: 'PDF',
    size: '1.5 MB',
    languages: ['QuickStart v1.2'],
    audience: 'Parents & Schools',
    audienceIcon: 'hub',
    category: 'Tool Manual',
    downloads: 5900,
    lastUpdated: 'Sep 12, 2024',
    status: 'Published',
    iconType: 'tool',
    iconName: 'build_circle'
  }
];

const AUDIENCE_FILTERS = [
  'All',
  'Parents & Caregivers',
  'Educators & Schools',
  'Policymakers',
  'Children & Youth'
];

const ResourceManagement = () => {
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [sortOrder, setSortOrder] = useState('Newest First');
  const [activeAudience, setActiveAudience] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [toastMessage, setToastMessage] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Modal State for "Add / Edit Resource"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newResource, setNewResource] = useState({
    title: '',
    audience: 'Parents & Caregivers',
    category: 'Safety Guides',
    status: 'Published',
    languages: 'EN',
    format: 'PDF',
    size: '3.2 MB'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Filter & Sort logic
  const filteredResources = useMemo(() => {
    return resources
      .filter((item) => {
        // Search
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          item.title.toLowerCase().includes(query) ||
          item.audience.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query);

        // Type Filter
        const matchesType =
          selectedType === 'All Types' ||
          (selectedType === 'PDF Guide' && item.category === 'Safety Guides') ||
          (selectedType === 'Curriculum' && item.category === 'Curriculum') ||
          (selectedType === 'Research Report' && item.category === 'Research Report') ||
          (selectedType === 'Toolkit' && (item.category === 'Tool Manual' || item.format.includes('Package')));

        // Status Filter
        const matchesStatus =
          selectedStatus === 'All Statuses' ||
          item.status.toLowerCase() === selectedStatus.toLowerCase();

        // Audience Filter
        const matchesAudience =
          activeAudience === 'All' ||
          item.audience.toLowerCase().includes(activeAudience.toLowerCase());

        return matchesSearch && matchesType && matchesStatus && matchesAudience;
      })
      .sort((a, b) => {
        if (sortOrder === 'Most Downloaded') return b.downloads - a.downloads;
        if (sortOrder === 'Title (A-Z)') return a.title.localeCompare(b.title);
        // default: Newest First
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      });
  }, [resources, searchQuery, selectedType, selectedStatus, sortOrder, activeAudience]);

  // Paginated View
  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredResources.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredResources, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredResources.length / rowsPerPage));

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredResources.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteResource = (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}"?`)) {
      setResources((prev) => prev.filter((r) => r.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      showToast(`Resource "${title}" removed.`);
    }
  };

  const handleDownload = (title) => {
    showToast(`Downloading package: "${title}"...`);
  };

  const handleExportData = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Title,Audience,Category,Downloads,Status,Last Updated']
        .concat(
          resources.map(
            (r) =>
              `"${r.title}","${r.audience}","${r.category}",${r.downloads},"${r.status}","${r.lastUpdated}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ifdc_resource_library.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Resource library exported as CSV.');
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item.id);
    setNewResource({
      title: item.title,
      audience: item.audience,
      category: item.category,
      status: item.status,
      languages: Array.isArray(item.languages) ? item.languages.join(', ') : item.languages,
      format: item.format,
      size: item.size
    });
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setNewResource({
      title: '',
      audience: 'Parents & Caregivers',
      category: 'Safety Guides',
      status: 'Published',
      languages: 'EN',
      format: 'PDF',
      size: '2.5 MB'
    });
    setIsModalOpen(true);
  };

  const handleSaveResource = (e) => {
    e.preventDefault();
    if (!newResource.title.trim()) {
      alert('Please provide a resource title.');
      return;
    }

    if (editingId) {
      // Update existing
      setResources((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
              ...r,
              title: newResource.title,
              audience: newResource.audience,
              category: newResource.category,
              status: newResource.status,
              languages: newResource.languages.split(',').map((l) => l.trim()),
              format: newResource.format,
              size: newResource.size
            }
            : r
        )
      );
      showToast('Resource metadata updated successfully!');
    } else {
      // Create new
      const created = {
        id: `res-${Date.now()}`,
        title: newResource.title,
        format: newResource.format,
        size: newResource.size,
        languages: newResource.languages.split(',').map((l) => l.trim()),
        audience: newResource.audience,
        audienceIcon:
          newResource.audience.includes('Educator')
            ? 'school'
            : newResource.audience.includes('Policy')
              ? 'gavel'
              : newResource.audience.includes('Children')
                ? 'smart_toy'
                : 'family_restroom',
        category: newResource.category,
        downloads: 0,
        lastUpdated: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        status: newResource.status,
        iconType: newResource.format.toLowerCase().includes('pdf') ? 'pdf' : 'doc',
        iconName: newResource.format.toLowerCase().includes('pdf') ? 'picture_as_pdf' : 'description'
      };
      setResources((prev) => [created, ...prev]);
      showToast('New resource successfully indexed!');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="rm-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0B3D6E] text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-sm animate-bounce">
          <span className="material-symbols-outlined text-[#FFE100] text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Command & Action Bar */}
      <div className="rm-header">
        <div>
          <div className="rm-system-tag">
            <span className="rm-system-version">Repository System / v2.4</span>
            <span className="rm-live-dot" />
            <span className="rm-live-text">Live Sync</span>
          </div>
          <h1 className="rm-title">Resource Management</h1>
          <p className="rm-subtitle">
            Upload, organize, and monitor educational toolkits, guides, curriculum PDFs, and safety materials across target demographics.
          </p>
        </div>

        <div className="rm-header-actions">
          <button type="button" className="rm-btn-secondary" onClick={handleExportData}>
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Library Data</span>
          </button>
          <button
            type="button"
            className="rm-btn-primary"
            onClick={handleOpenCreateModal}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>+ Add New Resource</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Bento Cards (4 Cards) */}
      <div className="rm-kpi-grid">
        {/* Card 1: Total Repository */}
        <div className="rm-kpi-card">
          <div className="rm-kpi-top">
            <div>
              <span className="rm-kpi-label">Total Repository</span>
              <div className="rm-kpi-value-row">
                <span className="rm-kpi-value">{141 + resources.length}</span>
              </div>
            </div>
            <div className="rm-kpi-icon navy">
              <span className="material-symbols-outlined text-[22px]">description</span>
            </div>
          </div>
          <div className="rm-kpi-footer">
            <span className="rm-kpi-trend">
              <span className="material-symbols-outlined">trending_up</span>+12
            </span>
            <span className="rm-kpi-note">indexed this month</span>
          </div>
        </div>

        {/* Card 2: Global Downloads */}
        <div className="rm-kpi-card">
          <div className="rm-kpi-top">
            <div>
              <span className="rm-kpi-label">Global Downloads</span>
              <div className="rm-kpi-value-row">
                <span className="rm-kpi-value">84.2K</span>
              </div>
            </div>
            <div className="rm-kpi-icon yellow">
              <span className="material-symbols-outlined text-[22px]">cloud_download</span>
            </div>
          </div>
          <div className="rm-kpi-footer">
            <span className="rm-kpi-trend">
              <span className="material-symbols-outlined">arrow_upward</span>+18%
            </span>
            <span className="rm-kpi-note">vs last quarter</span>
          </div>
        </div>

        {/* Card 3: Pending Review & Drafts */}
        <div className="rm-kpi-card">
          <div className="rm-kpi-top">
            <div>
              <span className="rm-kpi-label">Pending Review & Drafts</span>
              <div className="rm-kpi-value-row">
                <span className="rm-kpi-value">
                  {resources.filter((r) => r.status === 'Draft').length || 6}
                </span>
                <span className="rm-kpi-badge warning">Requires Action</span>
              </div>
            </div>
            <div className="rm-kpi-icon warning">
              <span className="material-symbols-outlined text-[22px]">pending_actions</span>
            </div>
          </div>
          <div className="rm-kpi-footer">
            <span className="text-[12px] text-[#74777F]">4 drafts, 2 under moderation</span>
            <span className="material-symbols-outlined text-[16px] text-[#74777F]">chevron_right</span>
          </div>
        </div>

        {/* Card 4: Taxonomy */}
        <div className="rm-kpi-card">
          <div className="rm-kpi-top">
            <div>
              <span className="rm-kpi-label">Taxonomy</span>
              <div className="rm-kpi-value-row">
                <span className="rm-kpi-value">8 Categories</span>
              </div>
            </div>
            <div className="rm-kpi-icon teal">
              <span className="material-symbols-outlined text-[22px]">label</span>
            </div>
          </div>
          <div className="rm-kpi-footer">
            <span className="inline-flex items-center gap-1.5 text-[12px] text-[#43474F] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#008575]" />
              <span>All active across 14 jurisdictions</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Control Section */}
      <div className="rm-controls-card">
        <div className="rm-controls-row">
          {/* Search Input */}
          <div className="rm-search-box">
            <span className="material-symbols-outlined rm-search-icon">search</span>
            <input
              type="text"
              className="rm-search-input"
              placeholder="Search by resource title, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="rm-search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Dropdown Filters */}
          <div className="rm-dropdowns-group">
            {/* Type */}
            <div className="rm-select-wrapper">
              <select
                className="rm-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option>All Types</option>
                <option>PDF Guide</option>
                <option>Curriculum</option>
                <option>Research Report</option>
                <option>Toolkit</option>
              </select>
              <span className="material-symbols-outlined rm-select-icon">arrow_drop_down</span>
            </div>

            {/* Status */}
            <div className="rm-select-wrapper">
              <select
                className="rm-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option>All Statuses</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
              <span className="material-symbols-outlined rm-select-icon">arrow_drop_down</span>
            </div>

            {/* Sort */}
            <div className="rm-select-wrapper">
              <select
                className="rm-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option>Newest First</option>
                <option>Most Downloaded</option>
                <option>Title (A-Z)</option>
              </select>
              <span className="material-symbols-outlined rm-select-icon">swap_vert</span>
            </div>

            {/* View Toggle */}
            <div className="rm-view-toggle">
              <button
                type="button"
                className={`rm-view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <span className="material-symbols-outlined text-[18px]">table_rows</span>
              </button>
              <button
                type="button"
                className={`rm-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </button>
            </div>
          </div>
        </div>

        {/* Audience Category Filter Pills */}
        <div className="rm-audience-pills">
          <span className="rm-audience-label">Audience:</span>
          {AUDIENCE_FILTERS.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`rm-pill ${activeAudience === cat ? 'active' : ''}`}
              onClick={() => setActiveAudience(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="rm-table-card">
          <div className="rm-table-wrapper">
            <table className="rm-table">
              <thead>
                <tr>
                  <th style={{ width: '44px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      className="rm-checkbox"
                      checked={
                        filteredResources.length > 0 &&
                        selectedIds.length === filteredResources.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Resource Title & Details</th>
                  <th>Target Audience</th>
                  <th style={{ textAlign: 'right' }}>Downloads</th>
                  <th>Last Updated</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedResources.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                      <div className="flex flex-col items-center justify-center text-[#74777F]">
                        <span className="material-symbols-outlined text-[40px] mb-2 text-[#C3C6CF]">
                          folder_off
                        </span>
                        <p className="font-semibold text-base text-[#1A1C1C]">No resources found</p>
                        <p className="text-sm mt-1">Try adjusting your search query or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedResources.map((item) => (
                    <tr key={item.id}>
                      {/* Checkbox */}
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          className="rm-checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleToggleSelect(item.id)}
                        />
                      </td>

                      {/* Title & Info */}
                      <td>
                        <div className="rm-item-title-cell">
                          <div className={`rm-item-icon ${item.iconType}`}>
                            <span className="material-symbols-outlined text-[20px]">
                              {item.iconName}
                            </span>
                          </div>
                          <div>
                            <span className="rm-item-name">{item.title}</span>
                            <div className="rm-item-meta">
                              <span>
                                {item.format} • {item.size}
                              </span>
                              <span>•</span>
                              <span className="rm-meta-lang">
                                {Array.isArray(item.languages)
                                  ? item.languages.join(' / ')
                                  : item.languages}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Target Audience */}
                      <td>
                        <span className="rm-audience-badge">
                          <span className="material-symbols-outlined">
                            {item.audienceIcon || 'family_restroom'}
                          </span>
                          <span>{item.audience}</span>
                        </span>
                      </td>

                      {/* Downloads */}
                      <td className="rm-downloads-cell">
                        <span className="rm-downloads-num">
                          {item.downloads.toLocaleString()}
                        </span>
                        {item.trendingTag && (
                          <span className="rm-downloads-tag">{item.trendingTag}</span>
                        )}
                      </td>

                      {/* Last Updated */}
                      <td className="rm-date-cell">{item.lastUpdated}</td>

                      {/* Status */}
                      <td>
                        <span
                          className={`rm-status-badge ${item.status === 'Published'
                              ? 'published'
                              : item.status === 'Draft'
                                ? 'draft'
                                : 'archived'
                            }`}
                        >
                          <span className="rm-status-dot" />
                          <span>{item.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="rm-actions-cell">
                          <button
                            type="button"
                            className="rm-action-btn"
                            title="Download Asset"
                            onClick={() => handleDownload(item.title)}
                          >
                            <span className="material-symbols-outlined text-[18px]">download</span>
                          </button>
                          <button
                            type="button"
                            className="rm-action-btn"
                            title="Edit Metadata"
                            onClick={() => handleOpenEditModal(item)}
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            type="button"
                            className="rm-action-btn delete"
                            title="Delete Resource"
                            onClick={() => handleDeleteResource(item.id, item.title)}
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="rm-pagination">
            <div>
              <span>
                Showing{' '}
                <strong className="text-[#0B3D6E]">
                  {filteredResources.length === 0
                    ? 0
                    : (currentPage - 1) * rowsPerPage + 1}
                  -
                  {Math.min(currentPage * rowsPerPage, filteredResources.length)}
                </strong>{' '}
                of <strong className="text-[#0B3D6E]">{filteredResources.length}</strong> resources
                {selectedIds.length > 0 && (
                  <span className="ml-3 font-semibold text-[#0B3D6E]">
                    ({selectedIds.length} selected)
                  </span>
                )}
              </span>
            </div>

            <div className="rm-page-buttons">
              <button
                type="button"
                className="rm-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                title="First Page"
              >
                <span className="material-symbols-outlined text-[18px]">first_page</span>
              </button>
              <button
                type="button"
                className="rm-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                <span>Prev</span>
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    className={`rm-page-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                className="rm-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <span>Next</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
              <button
                type="button"
                className="rm-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                title="Last Page"
              >
                <span className="material-symbols-outlined text-[18px]">last_page</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Grid View Alternate */
        <div className="rm-grid-view">
          {filteredResources.map((item) => (
            <div key={item.id} className="rm-grid-card">
              <div className="flex items-start justify-between gap-2">
                <div className={`rm-item-icon ${item.iconType}`}>
                  <span className="material-symbols-outlined text-[24px]">{item.iconName}</span>
                </div>
                <span
                  className={`rm-status-badge ${item.status === 'Published'
                      ? 'published'
                      : item.status === 'Draft'
                        ? 'draft'
                        : 'archived'
                    }`}
                >
                  <span className="rm-status-dot" />
                  <span>{item.status}</span>
                </span>
              </div>

              <div>
                <h3 className="font-bold text-[15px] text-[#0B3D6E] leading-snug mb-1">
                  {item.title}
                </h3>
                <div className="rm-item-meta">
                  <span>
                    {item.format} • {item.size}
                  </span>
                  <span>•</span>
                  <span className="rm-meta-lang">
                    {Array.isArray(item.languages)
                      ? item.languages.join('/')
                      : item.languages}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#ECEEF0] flex items-center justify-between text-xs">
                <span className="rm-audience-badge">
                  <span className="material-symbols-outlined text-[14px]">
                    {item.audienceIcon || 'family_restroom'}
                  </span>
                  <span>{item.audience}</span>
                </span>
                <span className="font-mono text-[#0B3D6E] font-bold">
                  {item.downloads.toLocaleString()} DLs
                </span>
              </div>

              <div className="flex items-center justify-end gap-1 pt-1">
                <button
                  type="button"
                  className="rm-action-btn"
                  title="Download"
                  onClick={() => handleDownload(item.title)}
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
                <button
                  type="button"
                  className="rm-action-btn"
                  title="Edit Metadata"
                  onClick={() => handleOpenEditModal(item)}
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  type="button"
                  className="rm-action-btn delete"
                  title="Delete"
                  onClick={() => handleDeleteResource(item.id, item.title)}
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Interactive Modal: Add / Edit Resource */}
      {isModalOpen && (
        <div className="rm-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="rm-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="rm-modal-header">
              <div className="rm-modal-title-group">
                <span className="material-symbols-outlined text-[#FFE100] text-[24px]">
                  {editingId ? 'edit_note' : 'cloud_upload'}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingId ? 'Edit Resource Details' : 'Add New Resource'}
                  </h3>
                  <p className="text-xs text-[#D4E3FF]">
                    Publish or save educational documentation
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="rm-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveResource}>
              <div className="rm-modal-body">
                {/* Title */}
                <div className="rm-modal-field">
                  <label>Resource Title *</label>
                  <input
                    type="text"
                    required
                    className="rm-modal-input"
                    placeholder="e.g., K-12 Student Safety Digital Handbook 2025"
                    value={newResource.title}
                    onChange={(e) =>
                      setNewResource({ ...newResource, title: e.target.value })
                    }
                  />
                </div>

                {/* Target Audience & Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rm-modal-field">
                    <label>Target Audience</label>
                    <select
                      className="rm-modal-select"
                      value={newResource.audience}
                      onChange={(e) =>
                        setNewResource({ ...newResource, audience: e.target.value })
                      }
                    >
                      <option>Parents & Caregivers</option>
                      <option>Educators & Schools</option>
                      <option>Parents & Educators</option>
                      <option>Policymakers</option>
                      <option>Policymakers & Research</option>
                      <option>Children & Youth</option>
                      <option>Parents & Schools</option>
                    </select>
                  </div>

                  <div className="rm-modal-field">
                    <label>Primary Category</label>
                    <select
                      className="rm-modal-select"
                      value={newResource.category}
                      onChange={(e) =>
                        setNewResource({ ...newResource, category: e.target.value })
                      }
                    >
                      <option>Safety Guides</option>
                      <option>Curriculum</option>
                      <option>Mental Health</option>
                      <option>Policy & Standards</option>
                      <option>Research Report</option>
                      <option>Interactive Materials</option>
                      <option>Tool Manual</option>
                    </select>
                  </div>
                </div>

                {/* Dropzone */}
                <div className="rm-modal-field">
                  <label>Upload File Attachment</label>
                  <div
                    className="rm-dropzone"
                    onClick={() => {
                      showToast('File attachment linked: safety-resource-update.pdf (5.2 MB)');
                      setNewResource({
                        ...newResource,
                        format: 'PDF',
                        size: '5.2 MB'
                      });
                    }}
                  >
                    <span className="material-symbols-outlined">upload_file</span>
                    <span className="text-sm font-semibold text-[#0B3D6E]">
                      Click to select or drag and drop
                    </span>
                    <span className="text-xs text-[#74777F] mt-1">
                      PDF, DOCX, ZIP, or EPUB up to 100MB
                    </span>
                  </div>
                </div>

                {/* Publishing Status & Languages */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rm-modal-field">
                    <label>Publishing Status</label>
                    <select
                      className="rm-modal-select"
                      value={newResource.status}
                      onChange={(e) =>
                        setNewResource({ ...newResource, status: e.target.value })
                      }
                    >
                      <option>Published</option>
                      <option>Draft</option>
                      <option>Archived</option>
                    </select>
                  </div>

                  <div className="rm-modal-field">
                    <label>Available Languages</label>
                    <input
                      type="text"
                      className="rm-modal-input"
                      placeholder="EN, ES, FR"
                      value={newResource.languages}
                      onChange={(e) =>
                        setNewResource({ ...newResource, languages: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="rm-modal-footer">
                  <button
                    type="button"
                    className="rm-btn-secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="rm-btn-primary">
                    {editingId ? 'Update Resource' : 'Save & Index Asset'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;
