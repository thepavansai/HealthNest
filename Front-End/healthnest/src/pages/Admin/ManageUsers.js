import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaPhone, FaSearch, FaUser, FaCalendarAlt, FaVenusMars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import './ManageUsers.css';
import { BASE_URL } from '../../config/apiConfig';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [flippedUserId, setFlippedUserId] = useState(null);
  const navigate = useNavigate();

  // Get auth header for API requests
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    // Check if user is logged in as admin
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'ADMIN') {
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${BASE_URL}/admin/users`, getAuthHeader());
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
        setLoading(false);
        
        // If unauthorized, redirect to login
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.clear();
          navigate('/login');
        }
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleFlipCard = (userId) => {
    setFlippedUserId(flippedUserId === userId ? null : userId);
  };

  const filteredUsers = users.filter(user => {
    return (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phoneNo && user.phoneNo.includes(searchTerm))
    );
  });

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading users data...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="error-container">
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="manage-users-container">
        <div className="users-header">
          <h1>Manage Users</h1>
          <div className="users-summary">
            <div className="summary-card">
              <div className="summary-icon">
                <FaUser />
              </div>
              <div className="summary-details">
                <h3>{users.length}</h3>
                <p>Total Users</p>
              </div>
            </div>
          </div>
        </div>
        <div className="users-filter">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ textAlign: searchTerm ? 'left' : 'center' }}
            />
          </div>
        </div>
        <div className="users-section">
          <h2>All Users</h2>
          {filteredUsers.length === 0 ? (
            <div className="no-data">
              <p>No users found matching your criteria</p>
            </div>
          ) : (
            <div className="users-grid">
              {filteredUsers.map(user => (
                <div
                  className={`flip-card ${flippedUserId === user.userId ? 'flipped' : ''}`}
                  key={user.userId}
                  onClick={() => handleFlipCard(user.userId)}
                >
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <div className="user-header">
                        <div className="user-avatar">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.name} />
                          ) : (
                            <div className="avatar-placeholder">
                              {user.name?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>
                        <h3>{user.name || 'Unknown'}</h3>
                        <p className="user-email">{user.email}</p>
                      </div>
                    </div>
                    <div className="flip-card-back">
                      <h3>{user.name || 'Unknown'}</h3>
                      <div className="flip-card-back-info">
                        <p>
                          <FaEnvelope className="info-icon" />
                          <span className="detail-label">Email:</span> {user.email}
                        </p>
                        <p>
                          <FaPhone className="info-icon" />
                          <span className="detail-label">Phone:</span> {user.phoneNo || 'N/A'}
                        </p>
                        <p>
                          <FaVenusMars className="info-icon" />
                          <span className="detail-label">Gender:</span> {user.gender || 'N/A'}
                        </p>
                        <p>
                          <FaCalendarAlt className="info-icon" />
                          <span className="detail-label">DoB:</span> {user.dateOfBirth || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ManageUsers;
