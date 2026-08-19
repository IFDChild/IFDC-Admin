import React from 'react';

const TopNav = () => {
  return (
    <header className="top-nav">
      <div className="search-container">
        <span className="material-symbols-outlined text-outline">search</span>
        <input 
          className="search-input" 
          placeholder="Search across dashboard..." 
          type="text"
        />
      </div>
      <div className="top-nav-actions">
        <button className="icon-btn">
          <span className="material-symbols-outlined">notifications</span>
          <span className="notification-dot"></span>
        </button>
        <button className="icon-btn">
          <span className="material-symbols-outlined">help</span>
        </button>
        <img 
          className="user-avatar-img" 
          alt="Admin Avatar" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4s-bsPT0-t5n5Q3WaxF_eP9tb1wBfHyAfpTf0i2_KJpqpRWr1_m1jwTcoOnoVPXzAsOw-we7zA7JxWTxh4t2gXY-zAEU3vX_Qo6R9GGQ1_hIrOtb1i3QWmfW13jacfhpvrh9wcW7KssJQ7sNQz6CtIe65IqdQZfTGPFtsekrNw2BOaf7YWDEGns0xPTSWX8la1AhVs6vAJ8BDBuXKyPy_9SPRFH-3JB9FEWem2prN6rRt6MpJOK5m"
        />
      </div>
    </header>
  );
};

export default TopNav;
