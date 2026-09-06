import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./screens.css";
import { createBlog, uploadBlogImage } from "../services/blogService";

const AddBlogPost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("Draft");
  const [loading, setLoading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const allCategories = ["News", "Education", "Safety Alerts", "Events", "Community"];

  const toggleCategory = (cat) =>
    setCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);



  const sectionTitle = {
    fontSize: "20px", fontWeight: 600, fontFamily: "Hanken Grotesk, sans-serif",
    color: "var(--on-surface)", borderBottom: "1px solid var(--border-subtle)",
    paddingBottom: "16px", marginBottom: "16px"
  };

  const cardStyle = { padding: "24px" };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a PNG, JPG, GIF, or WEBP image.");
      return;
    }

    // Validate size - 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    setFeaturedImage(file);

    // Preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (publish) => {

    try {

      if (!title.trim()) {
        alert("Please enter a blog title.");
        return;
      }

      if (!body.trim()) {
        alert("Please enter blog content.");
        return;
      }

      setLoading(true);

      let featuredImageUrl = null;


      // ============================
      // UPLOAD FEATURED IMAGE
      // ============================

      if (featuredImage) {

        setUploadingImage(true);

        const uploadResponse =
          await uploadBlogImage(
            featuredImage
          );

        featuredImageUrl =
          uploadResponse.url;

        setUploadingImage(false);
      }


      // ============================
      // CREATE BLOG
      // ============================

      const blogData = {

        title: title.trim(),

        excerpt: excerpt.trim(),

        content: body.trim(),

        featured_image:
          featuredImageUrl,

        author: "IFDC",

        category:
          categories.length > 0
            ? categories[0]
            : null,

        status: publish
          ? "published"
          : "draft",
      };


      console.log(
        "Sending blog:",
        blogData
      );


      const response =
        await createBlog(blogData);


      console.log(
        "Blog created:",
        response
      );


      alert(
        publish
          ? "Blog published successfully!"
          : "Blog saved as draft successfully!"
      );


      navigate("/blogs");


    } catch (error) {

      console.error(
        "Create blog error:",
        error
      );

      setUploadingImage(false);

      alert(
        error.message ||
        "Failed to create blog"
      );


    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="screen-container">
      {/* Breadcrumb */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--on-surface-variant)", marginBottom: "8px" }}>
          <button onClick={() => navigate("/blogs")}
            style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_back</span>
            Blog Management
          </button>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
          <span style={{ color: "var(--on-surface)" }}>Add New Post</span>
        </div>
        <h1 className="screen-title">Add New Post</h1>
      </div>

      {/* Two-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: "16px" }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Title */}
          <div className="glass-card" style={cardStyle}>
            <input autoFocus type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title"
              style={{
                width: "100%", fontSize: "24px", fontWeight: 600, fontFamily: "Hanken Grotesk, sans-serif",
                letterSpacing: "-0.01em", lineHeight: "32px", color: "var(--on-surface)",
                background: "transparent", border: "none", outline: "none"
              }} />
          </div>

          {/* Rich Text Editor */}
          <div className="glass-card" style={{ display: "flex", flexDirection: "column", height: "480px", overflow: "hidden", padding: 0 }}>
            <div style={{
              background: "var(--surface-container-low)", borderBottom: "1px solid var(--border-subtle)",
              padding: "8px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px"
            }}>
              {[
                { icon: "format_bold", title: "Bold" }, { icon: "format_italic", title: "Italic" },
                { icon: "format_underlined", title: "Underline" }, null,
                { icon: "format_list_bulleted", title: "Bullet List" }, { icon: "format_list_numbered", title: "Numbered List" }, null,
                { icon: "link", title: "Link" }, { icon: "image", title: "Insert Image" },
              ].map((item, i) =>
                item === null
                  ? <div key={i} style={{ width: "1px", height: "24px", background: "var(--border-subtle)", margin: "0 4px" }} />
                  : <button key={item.icon} title={item.title} className="icon-action" style={{ padding: "6px", borderRadius: "4px" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{item.icon}</span>
                  </button>
              )}
            </div>
            <textarea value={body} onChange={(e) => setBody(e.target.value)}
              placeholder="Start writing your post here..."
              style={{
                flex: 1, width: "100%", padding: "24px", resize: "none", border: "none", outline: "none",
                background: "transparent", fontSize: "16px", lineHeight: "24px", color: "var(--on-surface)",
                fontFamily: "Inter, sans-serif"
              }} />
          </div>

          {/* Excerpt */}
          <div className="glass-card" style={cardStyle}>
            <h3 style={{
              fontSize: "20px", fontWeight: 600, fontFamily: "Hanken Grotesk, sans-serif",
              color: "var(--on-surface)", marginBottom: "12px"
            }}>Excerpt</h3>
            <p style={{ fontSize: "13px", color: "var(--on-surface-variant)", marginBottom: "12px" }}>
              A short summary of the post used in blog lists and SEO.
            </p>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a brief excerpt..."
              style={{
                width: "100%", height: "96px", padding: "12px", borderRadius: "8px",
                border: "1px solid var(--border-subtle)", resize: "vertical", fontSize: "14px",
                color: "var(--on-surface)", background: "var(--surface-container-lowest)",
                outline: "none", fontFamily: "Inter, sans-serif"
              }} />
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Publishing */}
          <div className="glass-card" style={cardStyle}>
            <h3 style={sectionTitle}>Publishing</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--on-surface-variant)", fontWeight: 600 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>key</span> Status:
                </span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: status === "Published" ? "var(--status-active)" : "#B38600" }}>
                  {status}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--on-surface-variant)", fontWeight: 600 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>visibility</span> Visibility:
                </span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--on-surface)" }}>Public</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                className="btn btn-primary"
                onClick={() => handleSubmit(true)}
                disabled={loading}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  opacity: loading ? 0.6 : 1,
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {uploadingImage
                  ? "Uploading Image..."
                  : loading
                    ? "Publishing..."
                    : "Publish Now"}
              </button>
              <button
                className="btn"
                onClick={() => handleSubmit(false)}
                disabled={loading}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  background: "transparent",
                  border: "1px solid var(--primary)",
                  color: "var(--primary)",
                  opacity: loading ? 0.6 : 1,
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {uploadingImage
                  ? "Uploading Image..."
                  : loading
                    ? "Saving..."
                    : "Save Draft"}
              </button>
            </div>
          </div>

          {/* Featured Image */}
          {/* <div className="glass-card" style={cardStyle}>
            <h3 style={sectionTitle}>Featured Image</h3>
            <div style={{
              border: "2px dashed var(--outline-variant)", borderRadius: "8px", padding: "24px",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: "12px", cursor: "pointer", background: "var(--surface-container-lowest)", textAlign: "center",
              transition: "border-color 0.2s, background 0.2s"
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "var(--surface-container-low)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--outline-variant)"; e.currentTarget.style.background = "var(--surface-container-lowest)"; }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%", background: "var(--surface-container-high)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "var(--on-surface-variant)"
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>cloud_upload</span>
              </div>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--primary)", marginBottom: "4px" }}>Click to upload</p>
                <p style={{ fontSize: "13px", color: "var(--on-surface-variant)" }}>or drag and drop</p>
              </div>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "var(--on-surface-variant)", marginTop: "8px" }}>
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div> */}
          {/* Featured Image */}
          <div className="glass-card" style={cardStyle}>

            <h3 style={sectionTitle}>
              Featured Image
            </h3>

            {/* Hidden file input */}
            <input
              type="file"
              id="featured-image"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            {imagePreview ? (

              /* Image Preview */
              <div
                style={{
                  position: "relative",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "var(--surface-container-lowest)",
                  border: "1px solid var(--border-subtle)",
                }}
              >

                <img
                  src={imagePreview}
                  alt="Featured preview"
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => {
                    setFeaturedImage(null);
                    setImagePreview("");
                  }}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(0,0,0,0.7)",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "18px" }}
                  >
                    close
                  </span>
                </button>

                {/* Change image */}
                <label
                  htmlFor="featured-image"
                  style={{
                    display: "block",
                    padding: "12px",
                    textAlign: "center",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--primary)",
                    background: "var(--surface-container-low)",
                  }}
                >
                  Change Image
                </label>

              </div>

            ) : (

              /* Upload area */
              <label
                htmlFor="featured-image"
                style={{
                  border: "2px dashed var(--outline-variant)",
                  borderRadius: "8px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  cursor: "pointer",
                  background: "var(--surface-container-lowest)",
                  textAlign: "center",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--primary)";
                  e.currentTarget.style.background =
                    "var(--surface-container-low)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--outline-variant)";
                  e.currentTarget.style.background =
                    "var(--surface-container-lowest)";
                }}
              >

                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "var(--surface-container-high)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--on-surface-variant)",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "24px" }}
                  >
                    cloud_upload
                  </span>
                </div>

                <div>

                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--primary)",
                      marginBottom: "4px",
                    }}
                  >
                    Click to upload
                  </p>

                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--on-surface-variant)",
                    }}
                  >
                    or drag and drop
                  </p>

                </div>

                <p
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "10px",
                    color: "var(--on-surface-variant)",
                    marginTop: "8px",
                  }}
                >
                  PNG, JPG, GIF, WEBP up to 5MB
                </p>

              </label>

            )}

          </div>

          {/* Categories */}
          <div className="glass-card" style={cardStyle}>
            <h3 style={sectionTitle}>Categories</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "192px", overflowY: "auto" }}>
              {allCategories.map((cat) => (
                <label key={cat} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input type="checkbox" checked={categories.includes(cat)} onChange={() => toggleCategory(cat)}
                    style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }} />
                  <span style={{ fontSize: "14px", color: "var(--on-surface)" }}>{cat}</span>
                </label>
              ))}
            </div>
            <button style={{
              marginTop: "16px", display: "flex", alignItems: "center", gap: "4px",
              color: "var(--primary)", fontSize: "12px", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
              Add New Category
            </button>
          </div>

          {/* Tags */}
          {/* <div className="glass-card" style={cardStyle}>
            <h3 style={sectionTitle}>Tags</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()} placeholder="Add tags..."
                  style={{
                    flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-subtle)",
                    fontSize: "14px", color: "var(--on-surface)", background: "var(--surface-container-lowest)",
                    outline: "none", fontFamily: "Inter, sans-serif"
                  }} />
                <button onClick={addTag} style={{
                  padding: "8px 12px", borderRadius: "8px",
                  background: "var(--surface-container-high)", color: "var(--on-surface-variant)",
                  border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600
                }}>Add</button>
              </div>
              <p style={{ fontSize: "13px", color: "var(--on-surface-variant)", fontStyle: "italic" }}>
                Separate tags with commas
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {tags.map((tag) => (
                  <span key={tag} style={{
                    display: "inline-flex", alignItems: "center", gap: "4px",
                    padding: "4px 10px", borderRadius: "9999px", background: "var(--surface-container)",
                    color: "var(--on-surface-variant)", fontSize: "11px", fontWeight: 600
                  }}>
                    {tag}
                    <button onClick={() => removeTag(tag)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>close</span>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div> */}

        </div>
      </div>
    </div>
  );
};

export default AddBlogPost;
