import React from 'react';
import './Login.css';
import userIcon from '../../assets/images/USER.svg';
import lockIcon from '../../assets/images/lock.svg';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/order');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-title">EAT CHICKEN MANAGEMENT PLATFORM</div>
        <div className="login-input-wrapper">
          <img src={userIcon} alt="user icon" className="login-input-icon" />
          <input
            type="text"
            className="login-input"
            placeholder="Username"
            autoComplete="username"
          />
        </div>
        <div className="login-input-wrapper">
          <img src={lockIcon} alt="lock icon" className="login-input-icon" />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            autoComplete="current-password"
          />
        </div>
        <button className="login-btn" onClick={handleLogin}>Login</button>
        {/* Login form will be added here */}
      </div>
    </div>
  );
};

export default Login; 