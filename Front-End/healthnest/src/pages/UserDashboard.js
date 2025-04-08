import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './UserDashboard.css';
import axios from 'axios';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8080/users/userdetails/${userId}`)
        .then((res) => {
          setUserData(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch user details", err);
        });
    }
  }, [userId]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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
    navigate('/');
  };

  const handleBookAppointment = () => {
    navigate('/bookappointment');
  };

  const handleViewAppointments = () => {
    navigate('/viewappointments');
  };

  return (
    <div>
      <Header />
      <div className="user-dashboard-new">
        <div className="hero-banner">
          <h1 className="hero-text">Welcome back to HealthNest</h1>
          <p className="hero-subtext">Manage your health with ease.</p>

          <div className="profile-dropdown" onClick={toggleDropdown}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="User Icon"
              className="small-profile-icon"
            />
            {dropdownOpen && (
              <div className="dropdown-menu show">
                <button className="dropdown-item" onClick={handleEditProfile}>Edit Profile</button>
                <button className="dropdown-item" onClick={handleFeedback}>Feedback</button>
                <button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-card text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="User Avatar"
              className="profile-image"
            />
            <h5>{userData.name}</h5>
            <span className="badge bg-secondary">Patient</span>
            <p className="text-muted small">{userData.email}</p>
          </div>

          <div className="dashboard-card clickable" onClick={handleViewAppointments}>
            <h3 className="text-primary">2</h3>
            <p>View Appointments</p>
          </div>

          <div className="dashboard-card">
            <h3 className="text-success">5</h3>
            <p>Total Consultations</p>
          </div>

          <div className="dashboard-card">
            <h5>Quick Actions</h5>
            <div className="btn-group flex-wrap">
              <button className="btn btn-outline-primary" onClick={handleHealthCheck}>Health Check</button>
              <button className="btn btn-outline-warning" onClick={handleBookAppointment}>Book Appointment</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
