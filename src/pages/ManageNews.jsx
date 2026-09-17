import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./screens.css";
import {
  NEWS_CATEGORIES,
  deleteNews,
  getAllNews,
  newsImageUrl,
  updateNews,
} from "../services/newsService";

const formatDate = (date) => {
  if (!date) return "-";
  const value = new Date(/[zZ]|[+-]\d\d:\d\d$/.test(date) ? date : `${date}Z`);
  if (Number.isNaN(value.getTime())) return "-";
  return value.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const statusLabel = (status) => (status ? status.charAt(0).toUpperCase() + status.slice(1) : "-");

const ManageNews = () => {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getAllNews()
      .then((data) => {
        if (!cancelled) setArticles(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load news");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = articles.filter((item) => {
    const query = search.toLowerCase();
    const matchesSearch =
      (item.title || "").toLowerCase().includes(query) ||
      (item.summary || "").toLowerCase().includes(query);
    return (
      matchesSearch &&
      (!catFilter || item.category === catFilter) &&
      (!statusFilter || item.status === statusFilter)
    );
  });

  const toggleStatus = async (item) => {
    const next = item.status === "published" ? "draft" : "published";
    setBusyId(item.id);
    try {
      const updated = await updateNews(item.id, { status: next });
      setArticles((prev) => prev.map((a) => (a.id === item.id ? updated : a)));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setBusyId(item.id);
    try {
      await deleteNews(item.id);
      setArticles((prev) => prev.filter((a) => a.id !== item.id));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const publishedCount = articles.filter((a) => a.status === "published").length;

  return (
    <div className="screen-container">
      <div className="screen-header">
        <div>
          <h1 className="screen-title">Manage News</h1>
          <p className="screen-subtitle">
            Publish announcements, press releases, and event updates for the website.
            {!loading && !error && (
              <> {articles.length} total · {publishedCount} published.</>
            )}
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => navigate("/news/new")}>
          <span className="material-symbols-outlined">add</span>
          Add News
        </button>
      </div>

      <div className="glass-card table-card">
        <div className="toolbar">
          <div className="search-field">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Search news by title or summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="toolbar-filters">
            <select className="filter-select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
              <option value="">All Categories</option>
              {NEWS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table blog-table">
            <thead>
              <tr>
                <th style={{ minWidth: "250px", width: "40%" }}>Headline</th>
                <th>Category</th>
                <th>Created</th>
                <th>Published Date</th>
                <th className="text-center">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>Loading news...</td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "var(--error, #b3261e)" }}>{error}</td>
                </tr>
              )}

              {!loading && !error && filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                    {articles.length === 0 ? "No news yet. Click \u201cAdd News\u201d to publish the first article." : "No news matches these filters."}
                  </td>
                </tr>
              )}

              {!loading && !error && filtered.map((item) => (
                <tr key={item.id} className="table-row group-row" style={{ opacity: busyId === item.id ? 0.55 : 1 }}>
                  <td>
                    <div className="post-cell">
                      <div className="post-thumb">
                        {item.image ? (
                          <img
                            src={newsImageUrl(item.image)}
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                          />
                        ) : (
                          <span className="material-symbols-outlined" style={{ fontSize: "2rem", color: "#c3c6cf" }}>newspaper</span>
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <span className="post-title">{item.title}</span>
                        {item.summary && (
                          <p style={{ fontSize: "12px", color: "var(--on-surface-variant)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "360px" }}>
                            {item.summary}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="td-muted">{item.category || "-"}</td>
                  <td className="td-muted">{formatDate(item.created_at)}</td>
                  <td className="td-muted">{formatDate(item.published_at)}</td>

                  <td className="text-center">
                    <span className={`badge ${item.status === "published" ? "badge-active-sm" : "badge-draft"}`}>
                      {statusLabel(item.status)}
                    </span>
                  </td>

                  <td>
                    <div className="row-actions">
                      <button
                        className="icon-action"
                        title={item.status === "published" ? "Unpublish (move to draft)" : "Publish"}
                        disabled={busyId === item.id}
                        onClick={() => toggleStatus(item)}
                      >
                        <span className="material-symbols-outlined">
                          {item.status === "published" ? "unpublished" : "publish"}
                        </span>
                      </button>

                      <button
                        className="icon-action danger"
                        title="Delete"
                        disabled={busyId === item.id}
                        onClick={() => handleDelete(item)}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>
            Showing {filtered.length > 0 ? 1 : 0} to {filtered.length} of {articles.length} entries
          </span>
        </div>
      </div>
    </div>
  );
};

export default ManageNews;
