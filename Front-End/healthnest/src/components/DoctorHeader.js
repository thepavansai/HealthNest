import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

const DoctorHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('doctorName');
    const userId = localStorage.getItem('doctorId');
    if (storedUsername && userId) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('doctorName');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <Link className="brand" to="/">
            <span className="brand-name">HealthNest</span>
          </Link>
        </div>

        <div className="header-right">
          <nav className="nav-links">
            <Link to="/" className="nav-link">
              <FaHome /> Home
            </Link>
            <Link to="/about" className="nav-link">
              <FaInfoCircle /> About
            </Link>
          </nav>

          {isLoggedIn ? (
            <div className="user-controls">
              <div className="user-info">
                <span className="user-greeting">Welcome,</span>
                <span className="user-name">{localStorage.getItem('doctorName')}</span>
              </div>
              <button onClick={handleLogout} className="logout-button">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                <span className="btn-icon">👋</span>
                <span className="btn-text">Sign In</span>
              </Link>
              <Link to="/signup" className="btn-signup">
                <span className="btn-text">Get Started</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DoctorHeader;