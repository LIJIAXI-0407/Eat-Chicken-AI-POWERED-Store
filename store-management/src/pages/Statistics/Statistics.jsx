import React from 'react';
import Sidebar from '../../components/Sidebar';
import WelcomeHeader from '../../components/WelcomeHeader';
// import NotificationBell from '../../components/NotificationBell';
import '../../styles/shared.css';
import './statistics.css';

const Statistics = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        {/* <NotificationBell /> */}
        <div className="statistics-welcome-container">
          <WelcomeHeader />
        </div>
        <div className="statistics-content-container">
          <div className="statistics-video-frame">
            {/* Video content will go here */}
          </div>
          <div className="statistics-boxes-container">
            <div className="statistics-white-box">
              <div className="statistics-box-title">People Counting</div>
              <div className="statistics-box-number">0</div>
            </div>
            <div className="statistics-white-box second-box">
              <div className="statistics-box-title">Average Time</div>
              <div className="statistics-box-number">0.00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 