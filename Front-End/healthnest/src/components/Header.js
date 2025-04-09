import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus} from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
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
            <Link to="/aboutus" className="nav-link">
              <FaInfoCircle /> About
            </Link>
          </nav>

          {isLoggedIn ? (
            <div className="user-controls">
              <div className="user-info">
                <span className="user-greeting">Welcome,</span>
                <Link to="/user" className="user-name" title={username}>{username}</Link>
              </div>
              <button onClick={handleLogout} className="logout-button">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                <FaSignInAlt className="btn-icon" />
                <span className="btn-text">Sign In</span>
              </Link>
              <Link to="/signup" className="btn-signup">
                <FaUserPlus className="btn-icon" />
                <span className="btn-text">Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;