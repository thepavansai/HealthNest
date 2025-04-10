import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleFeedback = () => {
    navigate('/admin/viewfeedbacks');
  };

  const handleManageDoctors = () => {
    navigate('/admin/managedoctors');
  };

  const handleViewAppointments = () => {
    navigate('/admin/viewappointments');
  };

  const handleManageUsers = () => {
    navigate('/admin/manageusers');
  };

  return (
    <div>
      <Header />
      <div className="admin-dashboard">
        <div className="admin-hero">
          <div className="admin-hero-overlay">
            <h1 className="admin-hero-title">Welcome Admin</h1>
            <p className="admin-hero-subtitle">Manage the system with ease.</p>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-grid">
            { }
            <div className="admin-profile-card">
              <div className="admin-card">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="Admin Avatar"
                  className="admin-avatar"
                />
                <h5 className="admin-name">Admin Name</h5>
                <span className="admin-badge">Administrator</span>
                <p className="admin-email">admin@healthnest.com</p>
                <div className="admin-dropdown">
                  <button onClick={toggleDropdown} className="admin-button">
                    Profile
                  </button>
                  {dropdownOpen && (
                    <div className="admin-dropdown-menu">
                      <button className="admin-dropdown-item admin-logout" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            { }
            <div className="admin-actions">
              <div className="admin-stats">
                <div className="admin-card">
                  <h3 className="admin-stats-number">50</h3>
                  <p className="admin-stats-text">Total Consultations</p>
                </div>
              </div>

              <div className="admin-card">
                <h5 className="admin-section-title">Quick Actions</h5>
                <div className="admin-button-group">
                  <button className="admin-button admin-button-primary" onClick={handleManageDoctors}>
                    Manage Doctors
                  </button>
                  <button className="admin-button admin-button-success" onClick={handleViewAppointments}>
                    View Appointments
                  </button>
                  <button className="admin-button admin-button-warning" onClick={handleManageUsers}>
                    Manage Users
                  </button>
                  <button className="admin-button admin-button-primary" onClick={handleFeedback}>View Feedbacks</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
