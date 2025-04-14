import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isDoctor, setIsDoctor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const doctorId = localStorage.getItem('doctorId');
    const doctorName = localStorage.getItem('doctorName');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const adminId = localStorage.getItem('adminId');

    if (adminId) {
      setIsLoggedIn(true);
      setUsername(userName);
      setIsDoctor(false);
      setIsAdmin(true);
    } else if (doctorId && doctorName) {
      setIsLoggedIn(true);
      setUsername(doctorName);
      setIsDoctor(true);
      setIsAdmin(false);
    } else if (userId && userName) {
      setIsLoggedIn(true);
      setUsername(userName);
      setIsDoctor(false);
      setIsAdmin(false);
    } else {
      setIsLoggedIn(false);
      setUsername('');
      setIsDoctor(false);
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.header-right') && !event.target.closest('.hamburger-menu')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleLogout = () => {
    const itemsToClear = ['userId', 'userName', 'doctorId', 'doctorName', 'adminId'];
    itemsToClear.forEach(item => localStorage.removeItem(item));
    
    setIsLoggedIn(false);
    setUsername('');
    setIsDoctor(false);
    setIsAdmin(false);
    setIsMenuOpen(false);

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

        <div className="mobile-nav">
          <button 
            className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>

        <div className={`header-right ${isMenuOpen ? 'open' : ''}`}>
          <nav className="nav-links">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              <FaHome /> Home
            </Link>
            <Link to="/aboutus" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              <FaInfoCircle /> About
            </Link>
          </nav>

          {isLoggedIn ? (
            <div className="user-controls">
              <div className="user-info">
                <span className="user-greeting">Welcome,</span>
                <Link 
                  to={isAdmin ? "/admin" : isDoctor ? "/doctor/appointments" : "/user"} 
                  className="user-name" 
                  title={username}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {isDoctor ? `Dr. ${username}` : username}
                </Link>
              </div>
              <button onClick={handleLogout} className="logout-button">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login" onClick={() => setIsMenuOpen(false)}>
                <FaSignInAlt className="btn-icon" />
                <span className="btn-text">Sign In</span>
              </Link>
              <Link to="/signup" className="btn-signup" onClick={() => setIsMenuOpen(false)}>
                <FaUserPlus className="btn-icon" />
                <span className="btn-text">Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      {isMenuOpen && <div className="mobile-overlay" onClick={() => setIsMenuOpen(false)}></div>}
    </header>
  );
};

export default Header;