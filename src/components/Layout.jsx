import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const Layout = () => {
  return (
    <div className="app-layout">
      <div className="ambient-bg"></div>
      <Sidebar />
      
      <div className="main-content-wrapper">
        <TopNav />
        <main className="main-content">
          <Outlet />
        </main>
        
        <footer className="app-footer">
          <p className="footer-text">© 2024 IFDC Management System. All rights reserved.</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Technical Support</a>
            <a href="#" className="footer-link">Privacy Policy</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
