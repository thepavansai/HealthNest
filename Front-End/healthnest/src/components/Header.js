import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isDoctor, setIsDoctor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for doctor first, then user
    const doctorId = localStorage.getItem('doctorId');
    const doctorName = localStorage.getItem('doctorName');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    if (doctorId && doctorName) {
      setIsLoggedIn(true);
      setUsername(doctorName);
      setIsDoctor(true);
    } else if (userId && userName) {
      setIsLoggedIn(true);
      setUsername(userName);
      setIsDoctor(false);
    } else {
      // If neither doctor nor user is logged in
      setIsLoggedIn(false);
      setUsername('');
      setIsDoctor(false);
    }
  }, []);

  const handleLogout = () => {
    // Clear all relevant localStorage items
    const itemsToClear = ['userId', 'userName', 'doctorId', 'doctorName'];
    itemsToClear.forEach(item => localStorage.removeItem(item));
    
    // Reset states
    setIsLoggedIn(false);
    setUsername('');
    setIsDoctor(false);

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
                <Link 
                  to={isDoctor ? "/doctor/appointments" : "/user"} 
                  className="user-name" 
                  title={username}
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