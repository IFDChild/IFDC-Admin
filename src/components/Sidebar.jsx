import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">IFDC.</span>
        <div className="sidebar-user">
          <div className="sidebar-avatar">A</div>
          <div>
            <h2 className="sidebar-user-name">IFDC Admin</h2>
            <p className="sidebar-user-role">Management Portal</p>
          </div>
        </div>
      </div>
      
      <div className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} end>
          <span className="material-symbols-outlined fill-icon">dashboard</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/blogs" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <span className="material-symbols-outlined">article</span>
          <span>Blogs & News</span>
        </NavLink>
        <NavLink to="/volunteers" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <span className="material-symbols-outlined">group</span>
          <span>Volunteers</span>
        </NavLink>
        <NavLink to="/partners" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <span className="material-symbols-outlined">handshake</span>
          <span>Partners</span>
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => isActive ? "nav-link active mt-auto" : "nav-link mt-auto"}>
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Sidebar;
