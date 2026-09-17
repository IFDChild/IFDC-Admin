import React, { useEffect, useMemo, useState } from "react";
import "./screens.css";
import {
  DONATION_STATUSES,
  deleteDonationRequest,
  getDonationEmailStatus,
  getDonationRequests,
  resendDonationNotification,
  updateDonationRequest,
} from "../services/donationService";

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(/[zZ]|[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDateTime = (value) =>
  toDate(value)?.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) ?? "-";

const followUpLink = (email) => {
  const subject = encodeURIComponent("Thank you for offering to support IFDC");
  const body = encodeURIComponent(
    "Dear supporter,\n\nThank you for letting us know you would like to donate to the International Foundation for Digital Child (IFDC).\n\n" +
    "Here is how you can support our work:\n\n\n" +
    "With gratitude,\nIFDC Team"
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
};

const cell = { padding: "14px 16px", verticalAlign: "top" };

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [emailConfigured, setEmailConfigured] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [editingNotes, setEditingNotes] = useState({}); // id -> draft text
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([getDonationRequests(), getDonationEmailStatus()]).then(([list, mail]) => {
      if (cancelled) return;
      if (list.status === "fulfilled") setRequests(list.value);
      else setError(list.reason?.message || "Failed to load donation requests");
      if (mail.status === "fulfilled") setEmailConfigured(Boolean(mail.value.configured));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const result = { all: requests.length, new: 0, contacted: 0, closed: 0 };
    requests.forEach((r) => { result[r.status] = (result[r.status] || 0) + 1; });
    return result;
  }, [requests]);

  const filtered = requests.filter((r) =>
    (!statusFilter || r.status === statusFilter) &&
    (!search.trim() || `${r.email} ${r.name || ""} ${r.notes || ""}`.toLowerCase().includes(search.trim().toLowerCase()))
  );

  const replaceRow = (updated) => setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));

  const changeStatus = async (row, status) => {
    setBusyId(row.id);
    try {
      replaceRow(await updateDonationRequest(row.id, { status }));
      showToast(`Marked as ${DONATION_STATUSES[status].label.toLowerCase()}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const saveNotes = async (row) => {
    setBusyId(row.id);
    try {
      replaceRow(await updateDonationRequest(row.id, { notes: editingNotes[row.id] ?? "" }));
      setEditingNotes((prev) => {
        const next = { ...prev };
        delete next[row.id];
        return next;
      });
      showToast("Notes saved");
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const resend = async (row) => {
    setBusyId(row.id);
    try {
      const updated = await resendDonationNotification(row.id);
      replaceRow(updated);
      showToast(updated.admin_notified ? "Notification email sent" : "Email could not be sent - check the server logs");
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete the donation request from ${row.email}? This cannot be undone.`)) return;
    setBusyId(row.id);
    try {
      await deleteDonationRequest(row.id);
      setRequests((prev) => prev.filter((r) => r.id !== row.id));
      showToast("Request deleted");
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="screen-container">
      {toast && (
        <div role="status" style={{
          position: "fixed", top: "80px", right: "24px", zIndex: 9999, background: "#0B3D6E", color: "#fff",
          padding: "10px 18px", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          display: "flex", alignItems: "center", gap: "8px", fontSize: "14px"
        }}>
          <span className="material-symbols-outlined" style={{ color: "#FFE100", fontSize: "20px" }}>check_circle</span>
          {toast}
        </div>
      )}

      <div className="screen-header">
        <div>
          <h1 className="screen-title">Donation Requests</h1>
          <p className="screen-subtitle">
            People who offered to donate on the website. Email them to share how they can give, then update the status.
          </p>
        </div>
      </div>

      {emailConfigured === false && (
        <div style={{
          display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "16px", padding: "12px 16px",
          borderRadius: "10px", background: "#fff8db", border: "1px solid #f2d86b", color: "#6b5200", fontSize: "13.5px", lineHeight: 1.5
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>mail_lock</span>
          <span>
            <strong>Email notifications are off.</strong> New requests are still saved here, but no email is sent until SMTP
            settings (<code>SMTP_HOST</code>, <code>SMTP_USER</code>, <code>SMTP_PASSWORD</code>, <code>ADMIN_NOTIFY_EMAIL</code>) are added to the backend <code>.env</code> and the server is restarted.
          </span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "16px" }}>
        {[
          ["", "All requests", counts.all, "volunteer_activism"],
          ["new", "New", counts.new, "fiber_new"],
          ["contacted", "Contacted", counts.contacted, "forward_to_inbox"],
          ["closed", "Closed", counts.closed, "task_alt"],
        ].map(([value, label, count, icon]) => (
          <button
            key={label}
            type="button"
            onClick={() => setStatusFilter(value)}
            aria-pressed={statusFilter === value}
            className="glass-card"
            style={{
              padding: "14px 16px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px",
              border: statusFilter === value ? "2px solid #0B3D6E" : "1px solid var(--border-subtle, #e3e7ee)",
              background: "#fff"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "22px", color: "#0B3D6E" }}>{icon}</span>
            <span>
              <span style={{ display: "block", fontSize: "12px", color: "var(--on-surface-variant)", fontWeight: 600 }}>{label}</span>
              <span style={{ display: "block", fontSize: "22px", fontWeight: 800, color: "#0B3D6E" }}>{loading ? "…" : count}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="glass-card table-card">
        <div className="toolbar">
          <div className="search-field">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Search by email, name, or notes..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ minWidth: "240px" }}>Donor</th>
                <th>Received</th>
                <th className="text-center">Email alert</th>
                <th>Status</th>
                <th style={{ minWidth: "240px" }}>Notes</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>Loading donation requests...</td></tr>
              )}
              {!loading && error && (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#b3261e" }}>{error}</td></tr>
              )}
              {!loading && !error && filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "var(--on-surface-variant)" }}>
                    {requests.length === 0 ? "No donation requests yet. They appear here when visitors use the “I’m willing to donate” form." : "No requests match these filters."}
                  </td>
                </tr>
              )}

              {!loading && !error && filtered.map((row) => {
                const busy = busyId === row.id;
                const draft = editingNotes[row.id];
                return (
                  <tr key={row.id} className="table-row" style={{ opacity: busy ? 0.6 : 1 }}>
                    <td style={cell}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{
                          width: "36px", height: "36px", flex: "none", borderRadius: "50%", background: "#0B3D6E", color: "#FFE100",
                          display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px"
                        }}>
                          {(row.name || row.email).charAt(0).toUpperCase()}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <a href={`mailto:${row.email}`} style={{ fontWeight: 600, color: "#0B3D6E", wordBreak: "break-all" }}>{row.email}</a>
                          {row.name && <div style={{ fontSize: "12px", color: "var(--on-surface-variant)" }}>{row.name}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ ...cell, whiteSpace: "nowrap" }} className="td-muted">{formatDateTime(row.created_at)}</td>
                    <td style={cell} className="text-center">
                      {row.admin_notified ? (
                        <span title="Admin notification email sent" className="material-symbols-outlined" style={{ color: "#1a7a4a" }}>mark_email_read</span>
                      ) : (
                        <button
                          type="button"
                          className="icon-action"
                          title={emailConfigured ? "Not sent - resend notification" : "Not sent - email not configured"}
                          disabled={busy || !emailConfigured}
                          onClick={() => resend(row)}
                          style={{ color: "#b38600" }}
                        >
                          <span className="material-symbols-outlined">unsubscribe</span>
                        </button>
                      )}
                    </td>
                    <td style={cell}>
                      <select
                        value={row.status}
                        disabled={busy}
                        onChange={(e) => changeStatus(row, e.target.value)}
                        aria-label={`Status for ${row.email}`}
                        className="filter-select"
                      >
                        {Object.entries(DONATION_STATUSES).map(([value, meta]) => (
                          <option key={value} value={value}>{meta.label}</option>
                        ))}
                      </select>
                    </td>
                    <td style={cell}>
                      {draft !== undefined ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <textarea
                            value={draft}
                            onChange={(e) => setEditingNotes((prev) => ({ ...prev, [row.id]: e.target.value }))}
                            rows={3}
                            maxLength={5000}
                            aria-label={`Notes for ${row.email}`}
                            style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid var(--outline-variant)", fontSize: "13px", fontFamily: "inherit", resize: "vertical" }}
                          />
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button type="button" className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "12px" }} disabled={busy} onClick={() => saveNotes(row)}>Save</button>
                            <button
                              type="button"
                              className="btn"
                              style={{ padding: "6px 12px", fontSize: "12px", background: "transparent", border: "1px solid var(--outline-variant)" }}
                              onClick={() => setEditingNotes((prev) => { const next = { ...prev }; delete next[row.id]; return next; })}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditingNotes((prev) => ({ ...prev, [row.id]: row.notes || "" }))}
                          style={{ background: "none", border: 0, padding: 0, textAlign: "left", cursor: "pointer", fontSize: "13px", color: row.notes ? "var(--on-surface)" : "var(--outline)", whiteSpace: "pre-wrap" }}
                        >
                          {row.notes || "+ Add notes"}
                        </button>
                      )}
                    </td>
                    <td style={cell}>
                      <div className="row-actions">
                        <a
                          className="icon-action"
                          title="Email this donor"
                          href={followUpLink(row.email)}
                          onClick={() => { if (row.status === "new") changeStatus(row, "contacted"); }}
                        >
                          <span className="material-symbols-outlined">forward_to_inbox</span>
                        </a>
                        <button type="button" className="icon-action" title="Copy email address" onClick={() => navigator.clipboard?.writeText(row.email).then(() => showToast("Email copied"))}>
                          <span className="material-symbols-outlined">content_copy</span>
                        </button>
                        <button type="button" className="icon-action danger" title="Delete" disabled={busy} onClick={() => remove(row)}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Showing {filtered.length} of {requests.length} requests</span>
        </div>
      </div>
    </div>
  );
};

export default DonationRequests;
