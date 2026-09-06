
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./screens.css";
import { getBlogs } from "../services/blogService";

const ManageBlogs = () => {
  const navigate = useNavigate();

  // ==============================
  // STATE
  // ==============================

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==============================
  // FETCH BLOGS
  // ==============================

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBlogs();

        console.log("Blogs from API:", data);

        // If API returns array
        if (Array.isArray(data)) {
          setPosts(data);
        }

        // If API returns { blogs: [] }
        else if (Array.isArray(data.blogs)) {
          setPosts(data.blogs);
        }

        else {
          setPosts([]);
        }

      } catch (err) {
        console.error("Failed to load blogs:", err);

        setError(
          err.message || "Failed to load blogs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);


  // ==============================
  // IMAGE URL
  // ==============================

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `http://localhost:8000${image}`;
  };


  // ==============================
  // FORMAT DATE
  // ==============================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      );
    } catch {
      return "-";
    }
  };


  // ==============================
  // FILTER BLOGS
  // ==============================

  const filtered = posts.filter((post) => {
    const title = post.title || "";
    const author = post.author || "";
    const category = post.category || "";
    const status = post.status || "";

    const searchValue = search.toLowerCase();

    const matchesSearch =
      title.toLowerCase().includes(searchValue) ||
      author.toLowerCase().includes(searchValue);

    const matchesCategory =
      !catFilter || category === catFilter;

    const matchesStatus =
      !statusFilter || status === statusFilter;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus
    );
  });


  // ==============================
  // STATUS DISPLAY
  // ==============================

  const getStatusLabel = (status) => {
    if (!status) {
      return "-";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };


  // ==============================
  // RENDER
  // ==============================

  return (
    <div className="screen-container">

      {/* ============================
          HEADER
      ============================ */}

      <div className="screen-header">

        <div>
          <h1 className="screen-title">
            Manage Blogs & News
          </h1>

          <p className="screen-subtitle">
            Create, edit, and manage all content
            publications.
          </p>
        </div>


        <button
          className="btn btn-primary"
          onClick={() =>
            navigate("/blogs/new")
          }
        >
          <span className="material-symbols-outlined">
            add
          </span>

          Add New Post
        </button>

      </div>


      {/* ============================
          TABLE CARD
      ============================ */}

      <div className="glass-card table-card">


        {/* ============================
            TOOLBAR
        ============================ */}

        <div className="toolbar">

          {/* Search */}

          <div className="search-field">

            <span className="material-symbols-outlined">
              search
            </span>

            <input
              type="text"
              placeholder="Search posts by title or author..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          {/* Filters */}

          <div className="toolbar-filters">


            {/* Category */}

            <select
              className="filter-select"
              value={catFilter}
              onChange={(e) =>
                setCatFilter(e.target.value)
              }
            >

              <option value="">
                All Categories
              </option>

              <option value="News">
                News
              </option>

              <option value="Education">
                Education
              </option>

              <option value="Safety Alerts">
                Safety Alerts
              </option>

              <option value="Events">
                Events
              </option>

              <option value="Community">
                Community
              </option>

            </select>


            {/* Status */}

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >

              <option value="">
                All Statuses
              </option>

              <option value="published">
                Published
              </option>

              <option value="draft">
                Draft
              </option>

            </select>


            <button
              className="icon-action"
              title="More filters"
            >

              <span className="material-symbols-outlined">
                filter_list
              </span>

            </button>

          </div>

        </div>


        {/* ============================
            TABLE
        ============================ */}

        <div className="table-wrapper">

          <table className="data-table blog-table">

            <thead>

              <tr>

                <th
                  style={{
                    minWidth: "250px",
                    width: "38%",
                  }}
                >
                  Post Title
                </th>

                <th>
                  Category
                </th>

                <th>
                  Author
                </th>

                <th>
                  Published Date
                </th>

                <th className="text-center">
                  Status
                </th>

                <th className="text-right">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>


              {/* ============================
                  LOADING
              ============================ */}

              {loading && (

                <tr>

                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                    }}
                  >

                    Loading blogs...

                  </td>

                </tr>

              )}


              {/* ============================
                  ERROR
              ============================ */}

              {!loading && error && (

                <tr>

                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "red",
                    }}
                  >

                    {error}

                  </td>

                </tr>

              )}


              {/* ============================
                  EMPTY
              ============================ */}

              {!loading &&
                !error &&
                filtered.length === 0 && (

                  <tr>

                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                      }}
                    >

                      No blog posts found.

                    </td>

                  </tr>

                )}


              {/* ============================
                  BLOG ROWS
              ============================ */}

              {!loading &&
                !error &&
                filtered.length > 0 &&
                filtered.map((post) => (

                  <tr
                    key={post.id}
                    className="table-row group-row"
                  >


                    {/* ========================
                        TITLE + IMAGE
                    ======================== */}

                    <td>

                      <div className="post-cell">


                        <div className="post-thumb">

                          {post.featured_image ? (

                            <img
                              src={getImageUrl(
                                post.featured_image
                              )}
                              alt={post.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />

                          ) : (

                            <span
                              className="material-symbols-outlined"
                              style={{
                                fontSize: "2rem",
                                color: "#c3c6cf",
                              }}
                            >
                              image
                            </span>

                          )}

                        </div>


                        <span className="post-title">
                          {post.title}
                        </span>

                      </div>

                    </td>


                    {/* ========================
                        CATEGORY
                    ======================== */}

                    <td className="td-muted">

                      {post.category || "-"}

                    </td>


                    {/* ========================
                        AUTHOR
                    ======================== */}

                    <td className="td-muted">

                      {post.author || "-"}

                    </td>


                    {/* ========================
                        DATE
                    ======================== */}

                    <td className="td-muted">

                      {post.published_at
                        ? formatDate(
                          post.published_at
                        )
                        : "-"}

                    </td>


                    {/* ========================
                        STATUS
                    ======================== */}

                    <td className="text-center">

                      <span
                        className={`badge ${post.status === "published"
                            ? "badge-active-sm"
                            : "badge-draft"
                          }`}
                      >

                        {getStatusLabel(
                          post.status
                        )}

                      </span>

                    </td>


                    {/* ========================
                        ACTIONS
                    ======================== */}

                    <td>

                      <div className="row-actions">


                        {/* Edit */}

                        <button
                          className="icon-action"
                          title="Edit"
                          onClick={() =>
                            navigate(
                              `/blogs/edit/${post.id}`
                            )
                          }
                        >

                          <span className="material-symbols-outlined">
                            edit
                          </span>

                        </button>


                        {/* Preview */}

                        <button
                          className="icon-action"
                          title="Preview"
                          onClick={() =>
                            navigate(
                              `/blogs/view/${post.id}`
                            )
                          }
                        >

                          <span className="material-symbols-outlined">
                            visibility
                          </span>

                        </button>


                        {/* Delete / Unpublish */}

                        <button
                          className="icon-action danger"
                          title={
                            post.status ===
                              "published"
                              ? "Unpublish"
                              : "Delete"
                          }
                        >

                          <span className="material-symbols-outlined">

                            {post.status ===
                              "published"
                              ? "unpublished"
                              : "delete"}

                          </span>

                        </button>

                      </div>

                    </td>


                  </tr>

                ))}

            </tbody>

          </table>

        </div>


        {/* ============================
            FOOTER
        ============================ */}

        <div className="table-footer">

          <span>

            Showing{" "}

            {filtered.length > 0
              ? 1
              : 0}

            {" "}to{" "}

            {filtered.length}

            {" "}of{" "}

            {filtered.length}

            {" "}entries

          </span>


          <div className="pagination">

            <button
              className="page-btn"
              disabled
            >
              Prev
            </button>

            <button className="page-btn active">
              1
            </button>

            <button
              className="page-btn"
              disabled
            >
              Next
            </button>

          </div>

        </div>


      </div>

    </div>
  );
};

export default ManageBlogs;

