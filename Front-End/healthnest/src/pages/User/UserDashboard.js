import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './UserDashboard.css';
import axios from 'axios';
import { BASE_URL } from '../../config/apiConfig';
import { FaCalendarCheck, FaUserEdit, FaComment, FaSignOutAlt, FaHeartbeat, FaClipboardList, FaKey } from 'react-icons/fa';

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
        { /* Rest of the component remains the same */ }
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
        
        { /* Rest of the component remains the same */ }
        <div className="dashboard-grid">
          { /* Appointments card */ }
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
  Next: {appointments
    .filter(appointment => appointment.appointmentStatus === 'Upcoming')
    .slice(0, 1)
    .map(appointment => new Date(appointment.appointmentDate).toLocaleDateString())[0] || "No upcoming appointments"}
</p>

<p className="appointment-doctor">
  {appointments
    .filter(appointment => appointment.appointmentStatus === 'Upcoming')
    .slice(0, 1)
    .map(appointment =>"Dr. "+ appointment.doctorName)[0] || "No upcoming appointments"}
</p>

                </div>
              ) : (
                <p className="no-appointments">No upcoming appointments</p>
              )}
            </div>
          </div>
          
          { /* Health card */ }
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
          
          { /* Book appointment card */ }
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
          { /* Medical history card */ }
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
    </div>
  );
};

export default UserDashboard;
