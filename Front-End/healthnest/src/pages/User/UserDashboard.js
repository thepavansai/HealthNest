       import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './UserDashboard.css';
import axios from 'axios';
import { BASE_URL } from '../../config/apiConfig';
import { FaCalendarCheck, FaUserEdit, FaComment, FaSignOutAlt, FaHeartbeat, FaClipboardList, FaKey } from 'react-icons/fa';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Chatbot from '../../components/Chatbot';
import ErrorBoundary from '../../components/ErrorBoundary';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });
  const [appointments, setAppointments] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userId && token) {
      setLoading(true);
      
      // Configure headers with authorization token
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      // Make authenticated API requests
      const getUserDetails = axios.get(
        `${BASE_URL}/users/userdetails/${userId}`,
         { headers }
      );
      
      const getUserAppointments = axios.get(
        `${BASE_URL}/users/appointments/${userId}`,
         { headers }
      );
      
      Promise.all([getUserDetails, getUserAppointments])
        .then(([userRes, appointmentsRes]) => {
          setUserData(userRes.data);
          setAppointments(appointmentsRes.data || []);
        })
        .catch((err) => {
          console.error("Failed to fetch user data", err);
          // If unauthorized, redirect to login
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            localStorage.clear();
            navigate('/login');
          }
        })
 .finally(() => {
          setLoading(false);
        });
    } else {
      // If no userId or token, redirect to login
      navigate('/login');
    }
  }, [userId, token, navigate]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const closeDropdown = () => setDropdownOpen(false);
    if (dropdownOpen) {
      document.addEventListener('click', closeDropdown);
    }
    return () => document.removeEventListener('click', closeDropdown);
  }, [dropdownOpen]);

  const handleHealthCheck = () => navigate('remedies');
  const handleEditProfile = () => navigate('profile');
  const handleFeedback = () => navigate('feedback');
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };
  const handleBookAppointment = () => navigate('check-health');
  const handleViewAppointments = () => navigate('appointments');
  const handleChangePassword = () => navigate('change-password');

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header />
      <div className="user-dashboard-new">
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome back, {userData.name}</h1>
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
                <button onClick={handleChangePassword}>
                  <FaKey /> Change Password
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
        
        <div className="dashboard-grid">
          {/* Appointments card */}
          <div className="dashboard-card appointments-card" onClick={handleViewAppointments}>
            <div className="card-header">
              <h3>Appointments</h3>
              <span className="view-all">View All →</span>
            </div>
            <div className="card-content">
              <div className="appointments-layout">
                <div className="appointment-count-section">
                  <div className="appointment-count">
                    <FaCalendarCheck className="card-icon" />
                    <h2>{appointments.length || 0}</h2>
                  </div>
                  <p>Appointments</p>
                </div>
                <div className="appointment-lottie-section">
                  <DotLottieReact
                    src="https://lottie.host/a62e96b8-b70c-460a-a7d2-a725db527b6a/MNdZdSvJsX.lottie"
                    loop
                    autoplay
                  />
                </div>
              </div>
              
              {appointments.length > 0 ? (
                <div className="next-appointment">
                  <p className="appointment-date">
                    Next: {appointments.filter(appointment => appointment.appointmentStatus === 'Upcoming').slice(0, 1).map(appointment => new Date(appointment.appointmentDate).toLocaleDateString())[0] || "No upcoming appointments"}
                  </p>
                  <p className="appointment-doctor">
                    {appointments.filter(appointment => appointment.appointmentStatus === 'Upcoming').slice(0, 1).map(appointment => "Dr. " + appointment.doctorName)[0] || "No upcoming appointments"}
                  </p>
                </div>
              ) : (
                <p className="no-appointments">No upcoming appointments</p>
              )}
            </div>
          </div>
          
          {/* Health card */}
          <div className="dashboard-card health-card">
            <div className="card-header">
              <h3>Health Status</h3>
            </div>
            <div className="card-content">
              <div className="card-layout">
                <div className="card-info-section">
                  <div className="health-stats">
                    <FaHeartbeat className="card-icon pulse" />
                    <h2>{appointments.length || 0}</h2>
                  </div>
                  <p>Past Consultations</p>
                </div>
                <div className="card-lottie-section">
                  <DotLottieReact
                    src="https://lottie.host/98456cc8-ef87-403e-965a-1732afd862d3/7jn9fbANj2.lottie"
                    loop
                    autoplay
                  />
                </div>
              </div>
              <button className="btn-primary" onClick={handleHealthCheck}>
                Check Your Health
              </button>
            </div>
          </div>
          
          {/* Book appointment card */}
          <div className="dashboard-card action-card book-appointment">
            <div className="card-header">
              <h3>Book Appointment</h3>
            </div>
            <div className="card-content">
              <div className="card-layout">
                <div className="card-info-section">
                  <div className="action-icon-container">
                    <FaCalendarCheck className="action-icon" />
                  </div>
                  <p>Schedule a consultation with our healthcare professionals</p>
                </div>
                <div className="card-lottie-section">
                  <DotLottieReact
                    src="https://lottie.host/00be5420-12a7-423c-9f4d-16774b4365c6/GSkXej3ph2.lottie"
                    loop
                    autoplay
                  />
                </div>
              </div>
              <button className="action-btn primary" onClick={handleBookAppointment}>
                Book Now
              </button>
            </div>
          </div>
          
          {/* Medical history card */}
          <div className="dashboard-card action-card medical-history">
            <div className="card-header">
              <h3>Medical History</h3>
            </div>
            <div className="card-content">
              <div className="card-layout">
                <div className="card-info-section">
                  <div className="action-icon-container">
                    <FaClipboardList className="action-icon" />
                  </div>
                  <p>Access your complete medical records</p>
                </div>
                <div className="card-lottie-section">
                  <DotLottieReact
                    src="https://lottie.host/cae748d9-81b4-4d98-b3c0-a751e6844397/rLoHHIARUN.lottie"
                    loop
                    autoplay
                  />
                </div>
              </div>
              <button className="action-btn tertiary" onClick={handleViewAppointments}>
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ErrorBoundary>
        <Chatbot />
      </ErrorBoundary>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;
