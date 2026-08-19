import React, { useState } from 'react';
import './screens.css';

const posts = [
  {
    id: 1,
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJUdtA5l4EROEOQa9GC3Uxxm_2MaD4ooAZ82ZbbN7tNFdQA8x93JCQF6xG-m4o1r9l9ZuPI9GCbWlA_evrYiOn9677-WRFon6erR7SpDkezAx7fH-igCLuNdrhYeG6pXh4h--qUdP0ems-FOEcMdqGo3WP3iH7wY5TbvnqWfmRE_b8siAsRaGbv1hz7EQYsF9yzvfh12yatqa3gw0nVm4hYbHfdqix37pO8v5x1JEOC4so15Jcg33P',
    title: 'New Digital Literacy Initiative Launched for Rural Schools',
    category: 'News',
    author: 'Sarah Jenkins',
    date: 'Oct 24, 2024',
    status: 'Published',
    statusClass: 'badge-active-sm',
  },
  {
    id: 2,
    thumb: null,
    title: 'The Importance of Online Safety for Seniors in 2024',
    category: 'Blog',
    author: 'Marcus Thorne',
    date: '-',
    status: 'Draft',
    statusClass: 'badge-draft',
  },
  {
    id: 3,
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUmc4aa61F9qPfi358i8S_eoUB3ZdXxIoEASiWa2MP-sQ9Xhe52bK_-bj1-YmetorJwbFFx7CGx8vnCXCaqg59EBOwPBOiUlk9PjAikr3gksfNMY6jIT3lbiU__ET5Jy0wbUBk4Vg_IXcK1s0-1y2xeDQYLm-nlszmRzGeRrkDP4BHcbKFRNtY1GsZs4YgfKyFW3NRdzQItLvfNwS_xXMwtFDwkPteNunDSJ6SoTo41kzVxwnKZRrr',
    title: 'Annual IFDC Summit Highlights and Key Takeaways',
    category: 'News',
    author: 'Admin Team',
    date: 'Oct 15, 2024',
    status: 'Published',
    statusClass: 'badge-active-sm',
  },
  {
    id: 4,
    thumb: null,
    title: 'Child Safety in Digital Spaces: A Guide for Parents',
    category: 'Blog',
    author: 'Dr. Amara Singh',
    date: '-',
    status: 'Draft',
    statusClass: 'badge-draft',
  },
];

const ManageBlogs = () => {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    (!catFilter || p.category === catFilter) &&
    (!statusFilter || p.status === statusFilter)
  );

  return (
    <div className="screen-container">
      <div className="screen-header">
        <div>
          <h1 className="screen-title">Manage Blogs & News</h1>
          <p className="screen-subtitle">Create, edit, and manage all content publications.</p>
        </div>
        <button className="btn btn-primary">
          <span className="material-symbols-outlined">add</span>
          Add New Post
        </button>
      </div>

      {/* Table Card (Glassmorphism) */}
      <div className="glass-card table-card">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-field">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Search posts by title or author..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="toolbar-filters">
            <select className="filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              <option value="">All Categories</option>
              <option value="News">News</option>
              <option value="Blog">Blog</option>
            </select>
            <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
            <button className="icon-action" title="More filters">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-wrapper">
          <table className="data-table blog-table">
            <thead>
              <tr>
                <th style={{minWidth: '250px', width:'38%'}}>Post Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Published Date</th>
                <th className="text-center">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => (
                <tr key={post.id} className="table-row group-row">
                  <td>
                    <div className="post-cell">
                      <div className="post-thumb">
                        {post.thumb ? (
                          <img src={post.thumb} alt="thumb" />
                        ) : (
                          <span className="material-symbols-outlined" style={{fontSize:'2rem', color:'#c3c6cf'}}>image</span>
                        )}
                      </div>
                      <span className="post-title">{post.title}</span>
                    </div>
                  </td>
                  <td className="td-muted">{post.category}</td>
                  <td className="td-muted">{post.author}</td>
                  <td className="td-muted">{post.date}</td>
                  <td className="text-center">
                    <span className={`badge ${post.statusClass}`}>{post.status}</span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-action" title="Edit">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button className="icon-action" title="Preview">
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                      <button className="icon-action danger" title={post.status === 'Published' ? 'Unpublish' : 'Delete'}>
                        <span className="material-symbols-outlined">{post.status === 'Published' ? 'unpublished' : 'delete'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="table-footer">
          <span>Showing 1 to {filtered.length} of 42 entries</span>
          <div className="pagination">
            <button className="page-btn" disabled>Prev</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span style={{padding:'4px 8px', color: 'var(--on-surface-variant)'}}>...</span>
            <button className="page-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBlogs;
