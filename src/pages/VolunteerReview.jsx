import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./screens.css";

const VolunteerReview = () => {
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState({ identity: true, background: false, interview: false });
  const [coordinator, setCoordinator] = useState("1");
  const [notes, setNotes] = useState("");
  const [appStatus, setAppStatus] = useState("Pending Review");

  const cardStyle = { background:"#fff", border:"1px solid var(--border-subtle)", borderRadius:"8px", padding:"24px" };

  const handleApprove = () => setAppStatus("Approved");
  const handleReject = () => setAppStatus("Rejected");
  const handleHold = () => setAppStatus("On Hold");

  const statusColors = {
    "Pending Review": { bg:"rgba(179,134,0,0.1)", text:"#B38600", border:"rgba(179,134,0,0.2)" },
    "Approved": { bg:"rgba(0,133,117,0.1)", text:"#008575", border:"rgba(0,133,117,0.2)" },
    "Rejected": { bg:"rgba(186,26,26,0.1)", text:"#ba1a1a", border:"rgba(186,26,26,0.2)" },
    "On Hold": { bg:"rgba(11,61,110,0.1)", text:"#0B3D6E", border:"rgba(11,61,110,0.2)" },
  };
  const sc = statusColors[appStatus] || statusColors["Pending Review"];

  return (
    <div className="screen-container">
      {/* Header */}
      <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"32px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:"16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
            <button onClick={() => navigate("/volunteers")}
              style={{ padding:"8px", border:"1px solid var(--border-subtle)", borderRadius:"8px",
                background:"#fff", cursor:"pointer", color:"var(--on-surface-variant)",
                display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 1px 2px rgba(0,0,0,0.06)" }}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <h1 style={{ fontSize:"32px", fontWeight:700, fontFamily:"Hanken Grotesk, sans-serif",
                  letterSpacing:"-0.02em", color:"var(--primary)", lineHeight:"40px" }}>Elena Silva</h1>
                <span style={{ padding:"4px 8px", background:sc.bg, color:sc.text,
                  fontSize:"12px", fontWeight:600, borderRadius:"4px", border:`1px solid ${sc.border}` }}>
                  {appStatus}
                </span>
              </div>
              <p style={{ fontSize:"14px", color:"var(--on-surface-variant)", marginTop:"4px" }}>
                Application ID: <span style={{ fontFamily:"JetBrains Mono, monospace", fontSize:"12px" }}>VOL-2023-089</span>
                {" "}• Submitted 2 days ago
              </p>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap" }}>
            <button onClick={handleHold}
              style={{ padding:"8px 16px", border:"1px solid var(--primary)", color:"var(--primary)",
                fontWeight:600, fontSize:"14px", borderRadius:"8px", background:"transparent",
                cursor:"pointer", transition:"background 0.2s" }}>
              Put on Hold
            </button>
            <button onClick={handleReject}
              style={{ padding:"8px 16px", background:"rgba(186,26,26,0.1)", color:"#ba1a1a",
                fontWeight:600, fontSize:"14px", borderRadius:"8px", border:"none",
                cursor:"pointer", transition:"background 0.2s" }}>
              Reject
            </button>
            <button onClick={handleApprove} className="btn btn-primary" style={{ gap:"8px" }}>
              Approve Volunteer
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"minmax(0,2fr) minmax(0,1fr)", gap:"16px" }}>

        {/* LEFT */}
        <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

          {/* Applicant Info */}
          <div style={{ ...cardStyle, display:"flex", flexDirection:"row", gap:"24px", flexWrap:"wrap" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px", flexShrink:0 }}>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYfH19ZOyvmOgwI0-Vk7dcw916Ttl821tizgqclibMrLzaJ5P3gL72YQcJCgzDzyrk-eTavSZ2d3BhXSkszsYN6TEDzcmAhcb1EYIhh7WjsfZj_18HaGxZ__5PCYf4TsPigl17hoseB7jJaBSh-lapUUDBJW2VaHgGbz-dj15A6-VsOqYN3V19aFw3Zplgc4yXqHzEIbxMMWln-SMvu8674xKqtRP0mrl6R9uIajFPjUB3rI3ZAzXG"
                alt="Elena Silva"
                style={{ width:"128px", height:"128px", borderRadius:"8px", objectFit:"cover",
                  border:"1px solid var(--border-subtle)", boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }} />
              <button style={{ color:"var(--primary)", fontSize:"12px", fontWeight:600,
                display:"flex", alignItems:"center", gap:"4px", background:"none", border:"none", cursor:"pointer" }}>
                <span className="material-symbols-outlined" style={{ fontSize:"16px" }}>download</span>
                Download Photo
              </button>
            </div>
            <div style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
              <div>
                <p style={{ fontSize:"12px", fontWeight:600, color:"var(--on-surface-variant)",
                  textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"8px" }}>Contact Details</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                  {[
                    { icon:"mail", text:"elena.silva@example.com" },
                    { icon:"phone", text:"+1 (555) 123-4567" },
                    { icon:"location_on", text:"Seattle, WA (Willing to travel)" },
                  ].map(({ icon, text }) => (
                    <div key={icon} style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize:"20px", color:"#386093" }}>{icon}</span>
                      <span style={{ fontSize:"14px", color:"var(--on-surface)" }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize:"12px", fontWeight:600, color:"var(--on-surface-variant)",
                  textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"8px" }}>Application Info</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                  {[
                    { icon:"calendar_today", text:"Applied: Oct 24, 2023" },
                    { icon:"translate", text:"Languages: English, Spanish" },
                    { icon:"schedule", text:"Availability: 15 hrs/week" },
                  ].map(({ icon, text }) => (
                    <div key={icon} style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize:"20px", color:"#386093" }}>{icon}</span>
                      <span style={{ fontSize:"14px", color:"var(--on-surface)" }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Experience & Skills */}
          <div style={cardStyle}>
            <div style={{ marginBottom:"16px" }}>
              <h3 style={{ fontSize:"20px", fontWeight:600, fontFamily:"Hanken Grotesk, sans-serif", color:"var(--primary)", marginBottom:"4px" }}>
                Experience &amp; Skills
              </h3>
              <p style={{ fontSize:"13px", color:"var(--on-surface-variant)" }}>
                Primary Expertise:{" "}
                <span style={{ fontSize:"12px", fontWeight:600, color:"var(--primary)",
                  background:"rgba(212,227,255,0.5)", padding:"2px 8px", borderRadius:"4px" }}>
                  Education &amp; Tutoring
                </span>
              </p>
            </div>
            <div style={{ background:"var(--surface)", padding:"16px", borderRadius:"4px",
              border:"1px solid var(--border-subtle)", marginBottom:"16px" }}>
              <p style={{ fontSize:"14px", color:"var(--on-surface)", lineHeight:"20px" }}>
                "I have over 5 years of experience working as a secondary school math and science tutor. During my time at University,
                I organized community outreach programs aimed at increasing STEM literacy in underserved neighborhoods. I am highly
                proficient in curriculum development and adapting teaching methods to diverse learning styles."
              </p>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"12px", border:"1px solid var(--border-subtle)", borderRadius:"8px",
              background:"#fff", cursor:"pointer", transition:"background 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.background="var(--surface-container-low)"}
              onMouseLeave={(e) => e.currentTarget.style.background="#fff"}>
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <div style={{ width:"40px", height:"40px", background:"rgba(186,26,26,0.1)",
                  color:"#ba1a1a", borderRadius:"4px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                </div>
                <div>
                  <p style={{ fontSize:"12px", fontWeight:600, color:"var(--on-surface)" }}>Elena_Silva_Resume.pdf</p>
                  <p style={{ fontSize:"13px", color:"var(--on-surface-variant)" }}>2.4 MB • Uploaded Oct 24, 2023</p>
                </div>
              </div>
              <span className="material-symbols-outlined" style={{ color:"var(--on-surface-variant)" }}>open_in_new</span>
            </div>
          </div>

          {/* Motivation */}
          <div style={cardStyle}>
            <h3 style={{ fontSize:"20px", fontWeight:600, fontFamily:"Hanken Grotesk, sans-serif",
              color:"var(--primary)", marginBottom:"16px" }}>Motivation</h3>
            <div>
              <p style={{ fontSize:"12px", fontWeight:600, color:"var(--on-surface-variant)", marginBottom:"8px" }}>
                Why do you want to volunteer with IFDC?
              </p>
              <p style={{ fontSize:"14px", color:"var(--on-surface)", padding:"16px",
                background:"var(--surface)", borderRadius:"4px", border:"1px solid var(--border-subtle)", lineHeight:"20px" }}>
                "I have followed the International Foundation for Developing Children's work for years, particularly your initiatives
                in rural education access. Having grown up in a community where educational resources were scarce, I personally
                understand the transformative power of a dedicated mentor. I want to contribute my skills to ensure more children
                have the foundation they need to succeed."
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — Internal Review */}
        <div>
          <div style={{ background:"rgba(0,39,76,0.05)", border:"1px solid rgba(0,39,76,0.2)",
            borderRadius:"8px", padding:"24px", display:"flex", flexDirection:"column", gap:"24px",
            boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize:"20px", fontWeight:600, fontFamily:"Hanken Grotesk, sans-serif",
              color:"var(--primary)", display:"flex", alignItems:"center", gap:"8px", margin:0 }}>
              <span className="material-symbols-outlined">admin_panel_settings</span>
              Internal Review
            </h3>

            {/* Checklist */}
            <div>
              <p style={{ fontSize:"12px", fontWeight:600, color:"var(--primary)", marginBottom:"12px", letterSpacing:"0.02em" }}>
                Vetting Checklist
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {[
                  { key:"identity", label:"Identity Verified" },
                  { key:"background", label:"Background Check Cleared" },
                  { key:"interview", label:"Initial Interview Done" },
                ].map(({ key, label }) => (
                  <label key={key} style={{ display:"flex", alignItems:"center", gap:"12px", cursor:"pointer" }}>
                    <input type="checkbox" checked={checklist[key]}
                      onChange={(e) => setChecklist(prev => ({ ...prev, [key]: e.target.checked }))}
                      style={{ width:"20px", height:"20px", accentColor:"var(--primary)", borderRadius:"4px" }} />
                    <span style={{ fontSize:"14px", color:"var(--on-surface)" }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Coordinator */}
            <div>
              <p style={{ fontSize:"12px", fontWeight:600, color:"var(--primary)", marginBottom:"8px", letterSpacing:"0.02em" }}>
                Assigned Coordinator
              </p>
              <div style={{ position:"relative" }}>
                <select value={coordinator} onChange={(e) => setCoordinator(e.target.value)}
                  style={{ width:"100%", appearance:"none", background:"#fff",
                    border:"1px solid var(--border-subtle)", borderRadius:"8px",
                    padding:"10px 40px 10px 16px", fontSize:"14px",
                    color:"var(--on-surface)", outline:"none", fontFamily:"Inter, sans-serif",
                    cursor:"pointer" }}>
                  <option value="" disabled>Select Coordinator...</option>
                  <option value="1">Sarah Jenkins (Education Lead)</option>
                  <option value="2">Marcus Thorne (Field Ops)</option>
                  <option value="3">Unassigned</option>
                </select>
                <span className="material-symbols-outlined" style={{ position:"absolute", right:"12px", top:"50%",
                  transform:"translateY(-50%)", pointerEvents:"none", color:"var(--on-surface-variant)" }}>expand_more</span>
              </div>
            </div>

            {/* Admin Notes */}
            <div style={{ display:"flex", flexDirection:"column", flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
                <p style={{ fontSize:"12px", fontWeight:600, color:"var(--primary)", letterSpacing:"0.02em", margin:0 }}>Admin Notes</p>
                <span style={{ fontSize:"11px", color:"var(--on-surface-variant)" }}>Internal only</span>
              </div>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes regarding this applicant..."
                style={{ width:"100%", minHeight:"150px", background:"#fff",
                  border:"1px solid var(--border-subtle)", borderRadius:"8px",
                  padding:"12px", fontSize:"14px", color:"var(--on-surface)",
                  outline:"none", resize:"none", fontFamily:"Inter, sans-serif",
                  transition:"border-color 0.2s" }}
                onFocus={(e) => e.target.style.borderColor="var(--primary)"}
                onBlur={(e) => e.target.style.borderColor="var(--border-subtle)"} />
              <button style={{ marginTop:"12px", width:"100%", padding:"8px",
                background:"var(--primary)", color:"#fff", fontWeight:600, fontSize:"14px",
                borderRadius:"8px", border:"none", cursor:"pointer", transition:"opacity 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.opacity="0.9"}
                onMouseLeave={(e) => e.currentTarget.style.opacity="1"}>
                Save Notes
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VolunteerReview;
