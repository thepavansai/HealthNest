import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  Container,
} from '@mui/material';
import {
  CalendarToday,
  LocalHospital,
  HealthAndSafety,
  Edit,
  Feedback,
  Logout,
  Person,
  EventNote,
  MedicalServices,
  ArrowForward,
} from '@mui/icons-material';
import {
  FaUserEdit,
  FaComment,
  FaSignOutAlt,
  FaCalendarCheck,
  FaHeartbeat,
  FaClipboardList,
} from 'react-icons/fa';

import axios from 'axios';
import './UserDashboard.css';
import DoctorCarousel from '../components/DoctorCarousel';

const UserDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
const [appointments, setAppointments] = useState([]);

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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHealthCheck = () => {
    navigate('/checkhealth');
  };

  const handleEditProfile = () => {
    navigate('/editprofile');
    handleMenuClose();
  };

  const handleFeedback = () => {
    navigate('/feedback');
    handleMenuClose();
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
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };
  

  return (
    <Box className="dashboard-wrapper">
      <Header />
      <div className="user-dashboard-new">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome back, {userData.name || 'Patient'}</h1>
            <p className="subtitle">Manage your healthcare journey with ease</p>
          </div>
          <div className="profile-widget">
            <div className="profile-info" onClick={toggleDropdown}>
              <div className="profile-avatar">
                <img
                  src={userData.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                  alt={userData.name}
                />
              </div>
              <span className="profile-name">{userData.name}</span>
              <span className="profile-arrow">▼</span>
            </div>
            
            {dropdownOpen && (
              <div className="profile-dropdown-menu">
                <button onClick={handleEditProfile}>
                  <FaUserEdit /> Edit Profile
                </button>
                <button onClick={handleFeedback}>
                  <FaComment /> Send Feedback
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Appointments Card */}
          <div className="dashboard-card appointments-card" onClick={handleViewAppointments}>
            <div className="card-header">
              <h3>Appointments</h3>
              <span className="view-all">View All →</span>
            </div>
            <div className="card-content">
              <div className="appointment-count">
                <FaCalendarCheck className="card-icon" />
                <h2>{appointments.length || 0}</h2>
              </div>
              <p>Upcoming Appointments</p>
              {appointments.length > 0 ? (
                <div className="next-appointment">
                  <p className="appointment-date">
                    Next: {new Date(appointments[0].appointmentDate).toLocaleDateString()}
                  </p>
                  <p className="appointment-doctor">
                    Dr. {appointments[0].doctorName}
                  </p>
                </div>
              ) : (
                <p className="no-appointments">No upcoming appointments</p>
              )}
            </div>
          </div>
           {/* Book Appointment Card */}
           <div className="dashboard-card action-card book-appointment">
            <div className="card-header">
              <h3>Book Appointment</h3>
            </div>
            <div className="card-content">
              <div className="action-icon">
                <FaCalendarCheck />
              </div>
              <p>Schedule a consultation with our healthcare professionals</p>
              <button className="action-btn primary" onClick={handleBookAppointment}>
                Book Now
              </button>
            </div>
          </div>
          
          {/* Health Stats Card */}
          <div className="dashboard-card health-card">
            <div className="card-header">
              <h3>Health Status</h3>
            </div>
            <div className="card-content">
              <div className="health-stats">
                <FaHeartbeat className="card-icon pulse" />
                <h2>{appointments.length || 0}</h2>
              </div>
              <p>Past Consultations</p>
              <button className="btn-primary" onClick={handleHealthCheck}>
                Check Your Health
              </button>
            </div>
          </div>
          
         

          {/* Medical History Card */}
          <div className="dashboard-card action-card medical-history">
            <div className="card-header">
              <h3>Medical History</h3>
            </div>
            <div className="card-content">
              <div className="action-icon">
                <FaClipboardList />
              </div>
              <p>Access your complete medical records</p>
              <button className="action-btn tertiary" onClick={handleViewAppointments}>
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Box>
  );
};

export default UserDashboard; 