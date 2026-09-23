import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./screens.css";
import { NEWS_CATEGORIES, createNews, getNewsItem, newsImageUrl, updateNews, uploadNewsImage } from "../services/newsService";
import RichTextEditor from "../components/RichTextEditor";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const SUMMARY_LIMIT = 600;

const sectionTitle = {
  fontSize: "20px", fontWeight: 600, fontFamily: "Hanken Grotesk, sans-serif",
  color: "var(--on-surface)", borderBottom: "1px solid var(--border-subtle)",
  paddingBottom: "16px", marginBottom: "16px"
};

const cardStyle = { padding: "24px" };

const AddNews = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(null); // "published" | "draft" | null
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return undefined;

    let cancelled = false;
    setLoading(true);

    getNewsItem(id)
      .then((item) => {
        if (cancelled) return;
        setTitle(item.title || "");
        setContent(item.content || "");
        setSummary(item.summary || "");
        setCategory(item.category || "");
        setExistingImage(item.image || null);
        if (item.image) setImagePreview(newsImageUrl(item.image));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load this article");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id, isEdit]);

  // Release the object URL when the preview changes or the page unmounts.
  useEffect(() => () => {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Please select a PNG, JPG, GIF, or WEBP image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (status) => {
    setError("");

    if (title.trim().length < 3) {
      setError("Please enter a headline (at least 3 characters).");
      return;
    }
    if (!content.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()) {
      setError("Please enter the article content.");
      return;
    }

    setSaving(status);

    try {
      let imageUrl = existingImage;

      if (image) {
        setUploadingImage(true);
        const upload = await uploadNewsImage(image);
        imageUrl = upload.url;
        setUploadingImage(false);
      }

      const payload = {
        title: title.trim(),
        summary: summary.trim() || null,
        content: content.trim(),
        image: imageUrl,
        category: category || null,
        status,
      };

      if (isEdit) {
        await updateNews(id, payload);
      } else {
        await createNews(payload);
      }

      navigate("/news");
    } catch (err) {
      setUploadingImage(false);
      setError(err.message || "Failed to save news article");
    } finally {
      setSaving(null);
    }
  };

  const busy = saving !== null;

  const buttonLabel = (status, idle) => {
    if (saving !== status) return idle;
    if (uploadingImage) return "Uploading Image...";
    return status === "published" ? "Publishing..." : "Saving...";
  };

  return (
    <div className="screen-container">
      {/* Breadcrumb */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--on-surface-variant)", marginBottom: "8px" }}>
          <button
            onClick={() => navigate("/news")}
            style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 600 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_back</span>
            News Management
          </button>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
          <span style={{ color: "var(--on-surface)" }}>{isEdit ? "Edit News" : "Add News"}</span>
        </div>
        <h1 className="screen-title">{isEdit ? "Edit News" : "Add News"}</h1>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "12px 16px",
            borderRadius: "8px", background: "#fdecec", border: "1px solid #f5c2c2", color: "#a4262c", fontSize: "14px"
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>error</span>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: "16px" }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Headline */}
          <div className="glass-card" style={cardStyle}>
            <input
              autoFocus
              type="text"
              value={title}
              maxLength={255}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="News Headline"
              aria-label="News headline"
              style={{
                width: "100%", fontSize: "24px", fontWeight: 600, fontFamily: "Hanken Grotesk, sans-serif",
                letterSpacing: "-0.01em", lineHeight: "32px", color: "var(--on-surface)",
                background: "transparent", border: "none", outline: "none"
              }}
            />
          </div>

          {/* Content */}
          <div style={{ height: "520px" }}>
            <RichTextEditor
              value={content}
              onChange={setContent}
              onUploadImage={async (file) => (await uploadNewsImage(file)).url}
              placeholder="Write the full news story here…"
              height="100%"
            />
          </div>

          {/* Summary */}
          <div className="glass-card" style={cardStyle}>
            <h3 style={{ fontSize: "20px", fontWeight: 600, fontFamily: "Hanken Grotesk, sans-serif", color: "var(--on-surface)", marginBottom: "12px" }}>
              Summary
            </h3>
            <p style={{ fontSize: "13px", color: "var(--on-surface-variant)", marginBottom: "12px" }}>
              A short lead shown on news cards and in search previews.
            </p>
            <textarea
              value={summary}
              maxLength={SUMMARY_LIMIT}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write a brief summary..."
              aria-label="Summary"
              style={{
                width: "100%", height: "96px", padding: "12px", borderRadius: "8px",
                border: "1px solid var(--border-subtle)", resize: "vertical", fontSize: "14px",
                color: "var(--on-surface)", background: "var(--surface-container-lowest)",
                outline: "none", fontFamily: "Inter, sans-serif"
              }}
            />
            <p style={{ fontSize: "12px", color: "var(--on-surface-variant)", textAlign: "right", marginTop: "6px" }}>
              {summary.length}/{SUMMARY_LIMIT}
            </p>
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
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#B38600" }}>New</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--on-surface-variant)", fontWeight: 600 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>visibility</span> Visibility:
                </span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--on-surface)" }}>Public when published</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                className="btn btn-primary"
                onClick={() => handleSubmit("published")}
                disabled={busy}
                style={{ width: "100%", justifyContent: "center", opacity: busy ? 0.6 : 1, cursor: busy ? "not-allowed" : "pointer" }}
              >
                {buttonLabel("published", isEdit ? "Save & publish" : "Publish Now")}
              </button>
              <button
                className="btn"
                onClick={() => handleSubmit("draft")}
                disabled={busy}
                style={{
                  width: "100%", justifyContent: "center", background: "transparent",
                  border: "1px solid var(--primary)", color: "var(--primary)",
                  opacity: busy ? 0.6 : 1, cursor: busy ? "not-allowed" : "pointer"
                }}
              >
                {buttonLabel("draft", isEdit ? "Save as draft" : "Save Draft")}
              </button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="glass-card" style={cardStyle}>
            <h3 style={sectionTitle}>Featured Image</h3>

            <input
              type="file"
              id="news-image"
              accept={ALLOWED_IMAGE_TYPES.join(",")}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            {imagePreview ? (
              <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", background: "var(--surface-container-lowest)", border: "1px solid var(--border-subtle)" }}>
                <img src={imagePreview} alt="Featured preview" style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }} />
                <button
                  type="button"
                  onClick={removeImage}
                  aria-label="Remove image"
                  style={{
                    position: "absolute", top: "10px", right: "10px", width: "32px", height: "32px", borderRadius: "50%",
                    border: "none", background: "rgba(0,0,0,0.7)", color: "#fff", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
                </button>
                <label
                  htmlFor="news-image"
                  style={{ display: "block", padding: "12px", textAlign: "center", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "var(--primary)", background: "var(--surface-container-low)" }}
                >
                  Change Image
                </label>
              </div>
            ) : (
              <label
                htmlFor="news-image"
                style={{
                  border: "2px dashed var(--outline-variant)", borderRadius: "8px", padding: "24px",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: "12px", cursor: "pointer", background: "var(--surface-container-lowest)", textAlign: "center"
                }}
              >
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--surface-container-high)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--on-surface-variant)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>cloud_upload</span>
                </div>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--primary)" }}>Click to upload</p>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "var(--on-surface-variant)" }}>
                  PNG, JPG, GIF, WEBP up to 5MB
                </p>
              </label>
            )}
          </div>

          {/* Category */}
          <div className="glass-card" style={cardStyle}>
            <h3 style={sectionTitle}>Category</h3>
            <div role="radiogroup" aria-label="Category" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["", ...NEWS_CATEGORIES].map((cat) => (
                <label key={cat || "none"} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="news-category"
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                    style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
                  />
                  <span style={{ fontSize: "14px", color: cat ? "var(--on-surface)" : "var(--on-surface-variant)" }}>
                    {cat || "Uncategorised"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNews;
