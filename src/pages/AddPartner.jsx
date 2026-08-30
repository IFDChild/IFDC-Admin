import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./screens.css";

const AddPartner = () => {
  const navigate = useNavigate();
  const [tier, setTier] = useState("Strategic");
  const [orgType, setOrgType] = useState("");
  const [partnerStatus, setPartnerStatus] = useState("pending");
  const [assignedManager, setAssignedManager] = useState("");

  const inputStyle = {
    width:"100%", background:"#fff", border:"1px solid var(--border-subtle)",
    borderRadius:"8px", padding:"8px 12px", fontFamily:"Inter, sans-serif",
    fontSize:"14px", color:"var(--on-surface)", outline:"none",
    transition:"border-color 0.2s",
  };
  const labelStyle = { display:"block", fontSize:"12px", fontWeight:600,
    letterSpacing:"0.02em", color:"var(--on-surface-variant)", marginBottom:"8px" };
  const sectionStyle = { background:"#fff", border:"1px solid var(--border-subtle)", borderRadius:"8px", padding:"24px" };
  const sectionTitle = { fontSize:"20px", fontWeight:600, fontFamily:"Hanken Grotesk, sans-serif",
    color:"var(--primary)", marginBottom:"24px", paddingBottom:"16px",
    borderBottom:"1px solid var(--border-subtle)", display:"flex", alignItems:"center", gap:"8px" };

  return (
    <div className="screen-container">
      {/* Page Header */}
      <div style={{ marginBottom:"32px", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <button onClick={() => navigate("/partners")}
            style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"none", border:"none",
              cursor:"pointer", color:"var(--on-surface-variant)", fontSize:"14px", fontWeight:600,
              marginBottom:"8px", padding:0 }}>
            <span className="material-symbols-outlined" style={{ fontSize:"16px" }}>arrow_back</span>
            Strategic Partners
          </button>
          <h1 style={{ display:"flex", alignItems:"center", gap:"12px" }} className="screen-title">
            <span className="material-symbols-outlined" style={{ fontSize:"32px", color:"#0B3D6E" }}>domain_add</span>
            Add New Partner
          </h1>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <button onClick={() => navigate("/partners")}
            style={{ padding:"8px 24px", borderRadius:"8px", fontWeight:600, fontSize:"14px",
              border:"1px solid #0B3D6E", color:"#0B3D6E", background:"transparent", cursor:"pointer" }}>
            Cancel
          </button>
          <button className="btn btn-primary" style={{ gap:"8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize:"16px" }}>save</span>
            Save Partner
          </button>
        </div>
      </div>

      {/* Form Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"minmax(0,2fr) minmax(0,1fr)", gap:"16px" }}>

        {/* LEFT */}
        <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

          {/* Organization Details */}
          <div style={sectionStyle}>
            <h3 style={sectionTitle}>
              <span className="material-symbols-outlined" style={{ color:"#0B3D6E" }}>business</span>
              Organization Details
            </h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
              <div style={{ gridColumn:"1 / -1" }}>
                <label style={labelStyle}>Organization Name <span style={{ color:"var(--error)" }}>*</span></label>
                <input style={inputStyle} type="text" placeholder="e.g. Global Education Trust" />
              </div>
              <div>
                <label style={labelStyle}>Organization Type</label>
                <div style={{ position:"relative" }}>
                  <select value={orgType} onChange={(e) => setOrgType(e.target.value)}
                    style={{ ...inputStyle, appearance:"none", paddingRight:"40px" }}>
                    <option value="" disabled>Select type</option>
                    <option>Corporate</option>
                    <option>NGO / Non-Profit</option>
                    <option>Government Agency</option>
                    <option>Academic Institution</option>
                  </select>
                  <span className="material-symbols-outlined" style={{ position:"absolute", right:"12px", top:"50%",
                    transform:"translateY(-50%)", pointerEvents:"none", color:"var(--on-surface-variant)" }}>expand_more</span>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Website</label>
                <div style={{ position:"relative" }}>
                  <span className="material-symbols-outlined" style={{ position:"absolute", left:"12px", top:"50%",
                    transform:"translateY(-50%)", color:"var(--on-surface-variant)", fontSize:"16px" }}>language</span>
                  <input style={{ ...inputStyle, paddingLeft:"40px" }} type="url" placeholder="https://www.example.org" />
                </div>
              </div>
              <div style={{ gridColumn:"1 / -1" }}>
                <label style={labelStyle}>Headquarters Address</label>
                <input style={{ ...inputStyle, marginBottom:"8px" }} type="text" placeholder="Street Address" />
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                  <input style={inputStyle} type="text" placeholder="City" />
                  <input style={inputStyle} type="text" placeholder="Country" />
                </div>
              </div>
            </div>
          </div>

          {/* Partnership Information */}
          <div style={sectionStyle}>
            <h3 style={sectionTitle}>
              <span className="material-symbols-outlined" style={{ color:"#0B3D6E" }}>handshake</span>
              Partnership Information
            </h3>
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              <div>
                <label style={labelStyle}>Partnership Tier / Level</label>
                <div style={{ display:"flex", gap:"16px" }}>
                  {["Strategic", "Programmatic", "Sponsor"].map((t) => (
                    <label key={t} style={{
                      display:"flex", alignItems:"center", gap:"8px", cursor:"pointer",
                      padding:"12px", border:`1px solid ${tier === t ? "#0B3D6E" : "var(--border-subtle)"}`,
                      borderRadius:"8px", flex:1,
                      background: tier === t ? "rgba(11,61,110,0.05)" : "transparent",
                      transition:"border-color 0.2s, background 0.2s"
                    }}>
                      <input type="radio" name="tier" checked={tier === t} onChange={() => setTier(t)}
                        style={{ accentColor:"#0B3D6E" }} />
                      <span style={{ fontSize:"14px", fontWeight:600 }}>{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Mission Alignment</label>
                <textarea style={{ ...inputStyle, height:"96px", resize:"none" }}
                  placeholder="Describe how this organization's mission aligns with IFDC's goals..." />
              </div>
              <div>
                <label style={labelStyle}>Collaborative Goals</label>
                <textarea style={{ ...inputStyle, height:"96px", resize:"none" }}
                  placeholder="Outline primary objectives for this partnership..." />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

          {/* Primary Contact */}
          <div style={sectionStyle}>
            <h3 style={sectionTitle}>
              <span className="material-symbols-outlined" style={{ color:"#0B3D6E" }}>contact_mail</span>
              Primary Contact
            </h3>
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input style={inputStyle} type="text" placeholder="Jane Doe" />
              </div>
              <div>
                <label style={labelStyle}>Job Title</label>
                <input style={inputStyle} type="text" placeholder="Director of Partnerships" />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position:"relative" }}>
                  <span className="material-symbols-outlined" style={{ position:"absolute", left:"12px", top:"50%",
                    transform:"translateY(-50%)", color:"var(--on-surface-variant)", fontSize:"16px" }}>mail</span>
                  <input style={{ ...inputStyle, paddingLeft:"40px" }} type="email" placeholder="jane.doe@example.org" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <div style={{ position:"relative" }}>
                  <span className="material-symbols-outlined" style={{ position:"absolute", left:"12px", top:"50%",
                    transform:"translateY(-50%)", color:"var(--on-surface-variant)", fontSize:"16px" }}>call</span>
                  <input style={{ ...inputStyle, paddingLeft:"40px" }} type="tel" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            </div>
          </div>

          {/* Management */}
          <div style={{ ...sectionStyle, background:"var(--surface-bright)", borderColor:"rgba(11,61,110,0.2)" }}>
            <h3 style={sectionTitle}>
              <span className="material-symbols-outlined" style={{ color:"#0B3D6E" }}>admin_panel_settings</span>
              Management
            </h3>
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              <div>
                <label style={labelStyle}>Partnership Status</label>
                <div style={{ position:"relative" }}>
                  <select value={partnerStatus} onChange={(e) => setPartnerStatus(e.target.value)}
                    style={{ ...inputStyle, appearance:"none", paddingRight:"40px",
                      borderColor: partnerStatus === "pending" ? "rgba(179,134,0,0.5)" : "var(--border-subtle)",
                      background: partnerStatus === "pending" ? "rgba(179,134,0,0.05)" : "#fff" }}>
                    <option value="pending">Pending</option>
                    <option value="negotiation">In Negotiation</option>
                    <option value="active">Active</option>
                  </select>
                  <span className="material-symbols-outlined" style={{ position:"absolute", right:"12px", top:"50%",
                    transform:"translateY(-50%)", pointerEvents:"none",
                    color: partnerStatus === "pending" ? "#B38600" : "var(--on-surface-variant)" }}>expand_more</span>
                </div>
                <p style={{ fontSize:"13px", color:"var(--on-surface-variant)", marginTop:"4px", marginLeft:"4px" }}>
                  New partners default to Pending status.
                </p>
              </div>
              <div>
                <label style={labelStyle}>Assigned Manager</label>
                <div style={{ position:"relative" }}>
                  <select value={assignedManager} onChange={(e) => setAssignedManager(e.target.value)}
                    style={{ ...inputStyle, appearance:"none", paddingRight:"40px" }}>
                    <option value="" disabled>Assign a team member</option>
                    <option>Sarah Jenkins (Admin)</option>
                    <option>Michael Chen</option>
                    <option>Elena Rodriguez</option>
                  </select>
                  <span className="material-symbols-outlined" style={{ position:"absolute", right:"12px", top:"50%",
                    transform:"translateY(-50%)", pointerEvents:"none", color:"var(--on-surface-variant)" }}>expand_more</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddPartner;
