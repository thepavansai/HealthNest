import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleHealthCheck = () => {
    navigate('/checkhealth');
  };

  const handleEditProfile = () => {
    navigate('/editprofile');
  };

  const handleFeedback = () => {
    navigate('/feedback');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div>
      <Header />
      <div className="user-dashboard">
        <div className="hero-banner">
          <div className="overlay">
            <h1 className="hero-text">Welcome back to HealthNest</h1>
            <p className="hero-subtext">Manage your health with ease.</p>
          </div>
        </div>

        <div className="container mt-5">
          <div className="row g-4">
            {/* User Profile */}
            <div className="col-md-4">
              <div className="appointment-card profile-overview text-center p-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="User Avatar"
                  className="rounded-circle mb-3"
                />
                <h5 className="card-title mb-1">John Doe</h5>
                <span className="badge bg-secondary">Patient</span>
                <p className="text-muted mt-2 small">john.doe@email.com</p>
              </div>
            </div>

            {/* Appointments + Actions */}
            <div className="col-md-8">
              <div className="row mb-4">
                <div className="col-sm-6 mb-3">
                  <div className="appointment-card text-center py-4">
                    <h3 className="text-primary mb-1">2</h3>
                    <p className="mb-0">Upcoming Appointments</p>
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="appointment-card text-center py-4">
                    <h3 className="text-info mb-1">5</h3>
                    <p className="mb-0">Total Consultations</p>
                  </div>
                </div>
              </div>

              <div className="appointment-card p-4">
                <h5 className="mb-3 card-title">Quick Actions</h5>
                <div className="btn-group flex-wrap">
                  <button className="btn btn-outline-primary" onClick={handleHealthCheck}>Health Check</button>
                  <button className="btn btn-outline-secondary" onClick={handleEditProfile}>Edit Profile</button>
                  <button className="btn btn-outline-success" onClick={handleFeedback}>Give Feedback</button>
                  <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
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

export default UserDashboard;
