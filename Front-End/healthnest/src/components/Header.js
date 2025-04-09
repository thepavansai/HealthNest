import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    if (storedUsername && userId) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <Link className="brand" to="/">
            <span className="brand-name">HealthNest</span>
          </Link>
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className={`header-right ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
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
                <span className="user-name">{username}</span>
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

export default Header;