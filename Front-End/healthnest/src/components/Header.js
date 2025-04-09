import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

const Header = ({ name }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("userName");
    if (userId && storedName) {
      setIsLoggedIn(true);
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    navigate("/");
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
              <span className="user-name">Hi, {userName}</span>
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