import React, { useState } from 'react';
import './screens.css';
import { createBlog, uploadBlogImage } from '../services/blogService';

const BLOG_CATEGORIES = ['News', 'Education', 'Safety Alerts', 'Events', 'Community'];

const Overview = () => {
  // ── Blog modal state ────────────────────────────────────────────────────
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [blogTitle, setBlogTitle]         = useState('');
  const [blogBody, setBlogBody]           = useState('');
  const [blogExcerpt, setBlogExcerpt]     = useState('');
  const [blogCategories, setBlogCategories] = useState([]);
  const [blogStatus, setBlogStatus]       = useState('Draft');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview]   = useState('');
  const [loading, setLoading]             = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toastMsg, setToastMsg]           = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const resetModal = () => {
    setBlogTitle('');
    setBlogBody('');
    setBlogExcerpt('');
    setBlogCategories([]);
    setBlogStatus('Draft');
    setFeaturedImage(null);
    setImagePreview('');
    setLoading(false);
    setUploadingImage(false);
  };

  const openModal  = () => { resetModal(); setBlogModalOpen(true); };
  const closeModal = () => { resetModal(); setBlogModalOpen(false); };

  const toggleCategory = (cat) =>
    setBlogCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) { alert('Please select a PNG, JPG, GIF, or WEBP image.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Image size must be less than 5MB.'); return; }
    setFeaturedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (publish) => {
    if (!blogTitle.trim()) { alert('Please enter a blog title.'); return; }
    if (!blogBody.trim())  { alert('Please enter blog content.');  return; }
    try {
      setLoading(true);
      let featuredImageUrl = null;
      if (featuredImage) {
        setUploadingImage(true);
        const uploadResponse = await uploadBlogImage(featuredImage);
        featuredImageUrl = uploadResponse.url;
        setUploadingImage(false);
      }
      const blogData = {
        title:          blogTitle.trim(),
        excerpt:        blogExcerpt.trim(),
        content:        blogBody.trim(),
        featured_image: featuredImageUrl,
        author:         'IFDC',
        category:       blogCategories.length > 0 ? blogCategories[0] : null,
        status:         publish ? 'published' : 'draft',
      };
      await createBlog(blogData);
      showToast(publish ? 'Blog published successfully!' : 'Blog saved as draft!');
      closeModal();
    } catch (error) {
      setUploadingImage(false);
      alert(error.message || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      {/* ── Toast ── */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
          background: '#0B3D6E', color: '#fff', padding: '10px 18px',
          borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px',
        }}>
          <span className="material-symbols-outlined" style={{ color: '#FFE100', fontSize: '20px' }}>check_circle</span>
          {toastMsg}
        </div>
      )}

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
          <button className="btn btn-primary" onClick={openModal}>
            <span className="material-symbols-outlined">add_circle</span>
            Create Blog Post
          </button>
          <button className="btn btn-secondary">
            <span className="material-symbols-outlined">how_to_reg</span>
            Verify Volunteer
          </button>
        </div>
      </div>

      {/* ── Create Blog Post Modal ─────────────────────────────────────────── */}
      {blogModalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--surface, #fff)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            {/* Header */}
            <div style={{
              background: '#0B3D6E', padding: '20px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-outlined" style={{ color: '#FFE100', fontSize: '26px' }}>edit_note</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#fff' }}>Create Blog Post</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#D4E3FF' }}>Publish or save a new blog post to IFDC</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '8px',
                  width: '34px', height: '34px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>

            {/* Body */}
            <div style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: '20px' }}>

                {/* LEFT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  {/* Title */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--on-surface-variant, #555)', marginBottom: '6px' }}>
                      Post Title *
                    </label>
                    <input
                      autoFocus
                      type="text"
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      placeholder="e.g., Digital Safety Tips for 2025"
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: '8px',
                        border: '1px solid var(--border-subtle, #ddd)', fontSize: '15px',
                        fontWeight: 600, color: 'var(--on-surface, #111)',
                        background: 'var(--surface-container-lowest, #fafafa)',
                        outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--on-surface-variant, #555)', marginBottom: '6px' }}>
                      Content *
                    </label>
                    {/* Toolbar */}
                    <div style={{
                      background: 'var(--surface-container-low, #f5f5f5)',
                      borderRadius: '8px 8px 0 0',
                      border: '1px solid var(--border-subtle, #ddd)', borderBottom: 'none',
                      padding: '6px 8px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2px',
                    }}>
                      {[
                        { icon: 'format_bold', title: 'Bold' },
                        { icon: 'format_italic', title: 'Italic' },
                        { icon: 'format_underlined', title: 'Underline' },
                        null,
                        { icon: 'format_list_bulleted', title: 'Bullet List' },
                        { icon: 'format_list_numbered', title: 'Numbered List' },
                        null,
                        { icon: 'link', title: 'Link' },
                      ].map((item, i) =>
                        item === null
                          ? <div key={i} style={{ width: '1px', height: '20px', background: 'var(--border-subtle, #ddd)', margin: '0 4px' }} />
                          : <button key={item.icon} title={item.title} type="button"
                              style={{ padding: '5px', borderRadius: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant, #555)', display: 'flex' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{item.icon}</span>
                            </button>
                      )}
                    </div>
                    <textarea
                      value={blogBody}
                      onChange={(e) => setBlogBody(e.target.value)}
                      placeholder="Start writing your post here..."
                      style={{
                        width: '100%', height: '200px', padding: '12px 14px', resize: 'vertical',
                        borderRadius: '0 0 8px 8px', border: '1px solid var(--border-subtle, #ddd)',
                        fontSize: '14px', lineHeight: '22px', color: 'var(--on-surface, #111)',
                        background: 'var(--surface-container-lowest, #fafafa)',
                        outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--on-surface-variant, #555)', marginBottom: '4px' }}>
                      Excerpt
                    </label>
                    <p style={{ fontSize: '12px', color: 'var(--on-surface-variant, #888)', marginBottom: '6px', marginTop: 0 }}>
                      A short summary used in blog lists and SEO.
                    </p>
                    <textarea
                      value={blogExcerpt}
                      onChange={(e) => setBlogExcerpt(e.target.value)}
                      placeholder="Write a brief excerpt..."
                      style={{
                        width: '100%', height: '72px', padding: '10px 14px', resize: 'vertical',
                        borderRadius: '8px', border: '1px solid var(--border-subtle, #ddd)',
                        fontSize: '13px', color: 'var(--on-surface, #111)',
                        background: 'var(--surface-container-lowest, #fafafa)',
                        outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* RIGHT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  {/* Publishing Status */}
                  <div style={{ border: '1px solid var(--border-subtle, #ddd)', borderRadius: '10px', padding: '16px', background: 'var(--surface-container-lowest, #fafafa)' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700, color: 'var(--on-surface, #111)', borderBottom: '1px solid var(--border-subtle, #eee)', paddingBottom: '10px' }}>
                      Publishing
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--on-surface-variant, #555)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>key</span>Status:
                      </span>
                      <select
                        value={blogStatus}
                        onChange={(e) => setBlogStatus(e.target.value)}
                        style={{
                          padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle, #ddd)',
                          fontSize: '12px', fontWeight: 700, background: 'var(--surface-container, #f0f0f0)',
                          color: blogStatus === 'Published' ? '#1a7a4a' : '#B38600',
                          cursor: 'pointer', outline: 'none',
                        }}
                      >
                        <option>Draft</option>
                        <option>Published</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--on-surface-variant, #555)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>visibility</span>Visibility:
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--on-surface, #111)' }}>Public</span>
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div style={{ border: '1px solid var(--border-subtle, #ddd)', borderRadius: '10px', padding: '16px', background: 'var(--surface-container-lowest, #fafafa)' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700, color: 'var(--on-surface, #111)', borderBottom: '1px solid var(--border-subtle, #eee)', paddingBottom: '10px' }}>
                      Featured Image
                    </h4>
                    <input
                      type="file"
                      id="overview-blog-featured-image"
                      accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    {imagePreview ? (
                      <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle, #ddd)' }}>
                        <img src={imagePreview} alt="Featured preview" style={{ width: '100%', height: '130px', objectFit: 'cover', display: 'block' }} />
                        <button
                          type="button"
                          onClick={() => { setFeaturedImage(null); setImagePreview(''); }}
                          style={{
                            position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px',
                            borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.65)', color: '#fff',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                        </button>
                        <label htmlFor="overview-blog-featured-image" style={{
                          display: 'block', padding: '8px', textAlign: 'center', cursor: 'pointer',
                          fontSize: '12px', fontWeight: 600, color: 'var(--primary, #0B3D6E)',
                          background: 'var(--surface-container-low, #f5f5f5)',
                        }}>
                          Change Image
                        </label>
                      </div>
                    ) : (
                      <label
                        htmlFor="overview-blog-featured-image"
                        style={{
                          border: '2px dashed var(--outline-variant, #ccc)', borderRadius: '8px', padding: '20px 12px',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          gap: '8px', cursor: 'pointer', background: 'transparent', textAlign: 'center',
                          transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary, #0B3D6E)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--outline-variant, #ccc)'}
                      >
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          background: 'var(--surface-container-high, #e8e8e8)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--on-surface-variant, #555)',
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>cloud_upload</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: 'var(--primary, #0B3D6E)' }}>Click to upload</p>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--on-surface-variant, #888)' }}>PNG, JPG, GIF, WEBP up to 5MB</p>
                      </label>
                    )}
                  </div>

                  {/* Categories */}
                  <div style={{ border: '1px solid var(--border-subtle, #ddd)', borderRadius: '10px', padding: '16px', background: 'var(--surface-container-lowest, #fafafa)' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700, color: 'var(--on-surface, #111)', borderBottom: '1px solid var(--border-subtle, #eee)', paddingBottom: '10px' }}>
                      Categories
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {BLOG_CATEGORIES.map((cat) => (
                        <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--on-surface, #111)' }}>
                          <input
                            type="checkbox"
                            checked={blogCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                            style={{ width: '15px', height: '15px', accentColor: 'var(--primary, #0B3D6E)' }}
                          />
                          {cat}
                        </label>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 24px', borderTop: '1px solid var(--border-subtle, #eee)',
              display: 'flex', justifyContent: 'flex-end', gap: '10px',
              flexShrink: 0, background: 'var(--surface-container-low, #f7f7f7)',
            }}>
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                style={{
                  padding: '9px 20px', borderRadius: '8px', border: '1px solid var(--border-subtle, #ddd)',
                  background: 'transparent', color: 'var(--on-surface, #111)', fontSize: '14px',
                  fontWeight: 600, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={loading}
                style={{
                  padding: '9px 20px', borderRadius: '8px',
                  border: '1px solid #0B3D6E', background: 'transparent',
                  color: '#0B3D6E', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading && !uploadingImage ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="btn btn-primary"
                style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>publish</span>
                {uploadingImage ? 'Uploading Image...' : loading ? 'Publishing...' : 'Publish Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
