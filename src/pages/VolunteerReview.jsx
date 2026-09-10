import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MEDIA_URL } from "../services/apiConfig";
import { getVolunteer, statusMeta, updateVolunteerStatus } from "../services/volunteerService";
import "./screens.css";

const cardStyle = {
  background: "#fff",
  border: "1px solid var(--border-subtle)",
  borderRadius: "8px",
  padding: "24px",
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--on-surface-variant)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: "8px",
};

const quoteStyle = {
  fontSize: "14px",
  color: "var(--on-surface)",
  padding: "16px",
  background: "var(--surface)",
  borderRadius: "4px",
  border: "1px solid var(--border-subtle)",
  lineHeight: "22px",
  whiteSpace: "pre-line",
};

const STATUS_COLORS = {
  new: { bg: "rgba(179,134,0,0.1)", text: "#B38600", border: "rgba(179,134,0,0.2)" },
  reviewing: { bg: "rgba(11,61,110,0.1)", text: "#0B3D6E", border: "rgba(11,61,110,0.2)" },
  accepted: { bg: "rgba(0,133,117,0.1)", text: "#008575", border: "rgba(0,133,117,0.2)" },
  rejected: { bg: "rgba(186,26,26,0.1)", text: "#ba1a1a", border: "rgba(186,26,26,0.2)" },
};

const formatDateTime = (value) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const InfoRow = ({ icon, children }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
    <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#386093" }}>
      {icon}
    </span>
    <span style={{ fontSize: "14px", color: "var(--on-surface)", wordBreak: "break-word" }}>
      {children}
    </span>
  </div>
);

const VolunteerReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [pendingStatus, setPendingStatus] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      setApplication(await getVolunteer(id));
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Could not reach the server. Is the API running?"
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (status) => {
    setPendingStatus(status);
    setActionError("");

    try {
      setApplication(await updateVolunteerStatus(id, status));
    } catch (err) {
      setActionError(
        err instanceof TypeError
          ? "Could not reach the server. Is the API running?"
          : err.message
      );
    } finally {
      setPendingStatus("");
    }
  };

  if (isLoading) {
    return (
      <div className="screen-container">
        <p style={{ color: "var(--on-surface-variant)" }}>Loading application…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen-container">
        <button className="btn btn-secondary" onClick={() => navigate("/volunteers")} style={{ marginBottom: "16px" }}>
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Volunteers
        </button>
        <div
          role="alert"
          style={{
            padding: "16px",
            borderRadius: "8px",
            background: "rgba(186,26,26,0.08)",
            border: "1px solid rgba(186,26,26,0.25)",
            color: "#ba1a1a",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  if (!application) return null;

  const meta = statusMeta(application.status);
  const sc = STATUS_COLORS[application.status] || STATUS_COLORS.new;
  const isBusy = Boolean(pendingStatus);

  return (
    <div className="screen-container">
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => navigate("/volunteers")}
              title="Back to Volunteers"
              style={{
                padding: "8px", border: "1px solid var(--border-subtle)", borderRadius: "8px",
                background: "#fff", cursor: "pointer", color: "var(--on-surface-variant)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
              }}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <h1 style={{
                  fontSize: "32px", fontWeight: 700, fontFamily: "Hanken Grotesk, sans-serif",
                  letterSpacing: "-0.02em", color: "var(--primary)", lineHeight: "40px",
                }}>
                  {application.first_name} {application.last_name}
                </h1>
                <span style={{
                  padding: "4px 8px", background: sc.bg, color: sc.text,
                  fontSize: "12px", fontWeight: 600, borderRadius: "4px", border: `1px solid ${sc.border}`,
                }}>
                  {meta.label}
                </span>
              </div>
              <p style={{ fontSize: "14px", color: "var(--on-surface-variant)", marginTop: "4px" }}>
                Application ID:{" "}
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px" }}>
                  VOL-{String(application.id).padStart(4, "0")}
                </span>
                {" "}• Submitted {formatDateTime(application.created_at)}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={() => changeStatus("reviewing")}
              disabled={isBusy || application.status === "reviewing"}
              style={{
                padding: "8px 16px", border: "1px solid var(--primary)", color: "var(--primary)",
                fontWeight: 600, fontSize: "14px", borderRadius: "8px", background: "transparent",
                cursor: isBusy ? "not-allowed" : "pointer",
                opacity: application.status === "reviewing" ? 0.5 : 1,
              }}
            >
              {pendingStatus === "reviewing" ? "Saving…" : "Mark In Review"}
            </button>
            <button
              onClick={() => changeStatus("rejected")}
              disabled={isBusy || application.status === "rejected"}
              style={{
                padding: "8px 16px", background: "rgba(186,26,26,0.1)", color: "#ba1a1a",
                fontWeight: 600, fontSize: "14px", borderRadius: "8px", border: "none",
                cursor: isBusy ? "not-allowed" : "pointer",
                opacity: application.status === "rejected" ? 0.5 : 1,
              }}
            >
              {pendingStatus === "rejected" ? "Saving…" : "Reject"}
            </button>
            <button
              onClick={() => changeStatus("accepted")}
              disabled={isBusy || application.status === "accepted"}
              className="btn btn-primary"
              style={{ gap: "8px", opacity: application.status === "accepted" ? 0.5 : 1 }}
            >
              {pendingStatus === "accepted" ? "Approving…" : "Approve Volunteer"}
            </button>
          </div>
        </div>

        {actionError && (
          <div
            role="alert"
            style={{
              marginTop: "8px", padding: "12px 16px", borderRadius: "8px",
              background: "rgba(186,26,26,0.08)", border: "1px solid rgba(186,26,26,0.25)",
              color: "#ba1a1a", fontSize: "14px",
            }}
          >
            {actionError}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Step 1 - Basics */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: "20px", fontWeight: 600, fontFamily: "Hanken Grotesk, sans-serif", color: "var(--primary)", marginBottom: "16px" }}>
              Applicant Details
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div>
                <p style={labelStyle}>Contact</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <InfoRow icon="mail">
                    <a href={`mailto:${application.email}`} style={{ color: "var(--primary)" }}>
                      {application.email}
                    </a>
                  </InfoRow>
                  <InfoRow icon="phone">{application.phone || "Not provided"}</InfoRow>
                  <InfoRow icon="location_on">{application.address}</InfoRow>
                </div>
              </div>
              <div>
                <p style={labelStyle}>Profile</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <InfoRow icon="badge">{application.describes}</InfoRow>
                  <InfoRow icon="share">{application.social_media || "No social handles provided"}</InfoRow>
                  <InfoRow icon="calendar_today">Applied {formatDateTime(application.created_at)}</InfoRow>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 - Interests */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: "20px", fontWeight: 600, fontFamily: "Hanken Grotesk, sans-serif", color: "var(--primary)", marginBottom: "16px" }}>
              Areas of Interest
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {(application.interests || []).map((interest) => (
                <span
                  key={interest}
                  style={{
                    fontSize: "13px", fontWeight: 600, color: "var(--primary)",
                    background: "rgba(212,227,255,0.5)", padding: "6px 12px", borderRadius: "6px",
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Step 3 - Motivation */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: "20px", fontWeight: 600, fontFamily: "Hanken Grotesk, sans-serif", color: "var(--primary)", marginBottom: "16px" }}>
              Motivation
            </h3>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--on-surface-variant)", marginBottom: "8px" }}>
              Why would you like to volunteer with us, and what do you hope to contribute or learn?
            </p>
            <p style={quoteStyle}>{application.motivation}</p>
          </div>

          {/* CV */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: "20px", fontWeight: 600, fontFamily: "Hanken Grotesk, sans-serif", color: "var(--primary)", marginBottom: "16px" }}>
              Attached CV
            </h3>
            {application.cv_url ? (
              <a
                href={`${MEDIA_URL}${application.cv_url}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px", border: "1px solid var(--border-subtle)", borderRadius: "8px",
                  background: "#fff", textDecoration: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "40px", height: "40px", background: "rgba(186,26,26,0.1)", color: "#ba1a1a",
                    borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--on-surface)" }}>
                      {application.cv_url.split("/").pop()}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--on-surface-variant)" }}>Opens in a new tab</p>
                  </div>
                </div>
                <span className="material-symbols-outlined" style={{ color: "var(--on-surface-variant)" }}>open_in_new</span>
              </a>
            ) : (
              <p style={{ fontSize: "14px", color: "var(--on-surface-variant)" }}>
                No CV was attached to this application.
              </p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div>
          <div style={{
            background: "rgba(0,39,76,0.05)", border: "1px solid rgba(0,39,76,0.2)",
            borderRadius: "8px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <h3 style={{
              fontSize: "20px", fontWeight: 600, fontFamily: "Hanken Grotesk, sans-serif",
              color: "var(--primary)", display: "flex", alignItems: "center", gap: "8px", margin: 0,
            }}>
              <span className="material-symbols-outlined">admin_panel_settings</span>
              Review Status
            </h3>

            <div>
              <p style={{ ...labelStyle, marginBottom: "8px" }}>Current Status</p>
              <span style={{
                display: "inline-block", padding: "6px 12px", background: sc.bg, color: sc.text,
                fontSize: "13px", fontWeight: 600, borderRadius: "6px", border: `1px solid ${sc.border}`,
              }}>
                {meta.label}
              </span>
            </div>

            <div>
              <p style={{ ...labelStyle, marginBottom: "8px" }}>Last Updated</p>
              <p style={{ fontSize: "14px", color: "var(--on-surface)" }}>
                {formatDateTime(application.updated_at)}
              </p>
            </div>

            <div style={{ borderTop: "1px solid rgba(0,39,76,0.15)", paddingTop: "16px" }}>
              <p style={{ ...labelStyle, marginBottom: "12px" }}>Decision</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  onClick={() => changeStatus("accepted")}
                  disabled={isBusy || application.status === "accepted"}
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", opacity: application.status === "accepted" ? 0.5 : 1 }}
                >
                  {pendingStatus === "accepted" ? "Approving…" : "Approve Volunteer"}
                </button>
                <button
                  onClick={() => changeStatus("rejected")}
                  disabled={isBusy || application.status === "rejected"}
                  style={{
                    width: "100%", padding: "10px", background: "rgba(186,26,26,0.1)", color: "#ba1a1a",
                    fontWeight: 600, fontSize: "14px", borderRadius: "8px", border: "none",
                    cursor: isBusy ? "not-allowed" : "pointer",
                    opacity: application.status === "rejected" ? 0.5 : 1,
                  }}
                >
                  {pendingStatus === "rejected" ? "Saving…" : "Reject Application"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerReview;
