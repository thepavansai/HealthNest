import axios from 'axios';

import React, { useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaKey,
  FaSignOutAlt,
  FaTrashAlt,
  FaUserMd
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DoctorHeader from '../components/DoctorHeader';
import Footer from '../components/Footer';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [doctorData, setDoctorData] = useState({ doctorName: '', emailId: '' });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    // Fetch doctor profile
    if (doctorId) {
      axios.get(`http://localhost:8080/doctor/profile/${doctorId}`)
        .then(res => {
          setDoctorData(res.data || {});
        })
        .catch(err => {
          console.error("Error fetching doctor profile:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [doctorId]);

  useEffect(() => {
    // Fetch today's appointments
    if (doctorId) {
      const today = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
     // today=2025-04-15
      axios.get(`http://localhost:8080/appointments/doctor/${doctorId}/date/${today}`)
        .then(res => {
          setAppointments(res.data || []);
        })
        .catch(err => {
          console.error("Error fetching today's appointments:", err);
        });
    }
  }, [doctorId]);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard-wrapper">
      <DoctorHeader />

      <main className="doctor-dashboard-container">
        { }
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome back, {doctorData.doctorName || 'Doctor'} 👋</h1>
            <p className="subtitle">Here’s what’s happening with your practice today.</p>
          </div>

          <div className="profile-widget">
            <div className="profile-info" onClick={toggleDropdown}>
              <div className="profile-avatar"></div>
              <span className="profile-arrow">▼</span>
            </div>

            {showDropdown && (
              <div className="profile-dropdown-menu">
                <button onClick={() => navigate("/doctor/editprofile")}><FaUserMd /> Edit Profile</button>
                <button onClick={() => navigate("/changepassword")}><FaKey /> Change Password</button>
                <button onClick={() => navigate("/deleteaccount")}><FaTrashAlt /> Delete Account</button>
                <button onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}><FaSignOutAlt /> Logout</button>
              </div>
            )}
          </div>
        </div>

        { }
        <div className="dashboard-grid">
          <div className="dashboard-card patient-overview-card">
            <div className="card-header">
              <h3>Today's Appointments</h3>
              <a href='/doctor/viewappointments'>View All</a>
            </div>
            <div className="card-content">
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <div key={index} className="appointment-item">
                    <FaCalendarAlt className="card-icon pulse" />
                    <h6>{appointment.appointmentTime}</h6>
                    <p>{appointment.userName} - {appointment.description}</p>
                  </div>
                ))
              ) : (
                <p>No appointments for today.</p>
              )}
            </div>
          </div>
              {/* Stats Viewing Card */}
          <div className="dashboard-card stats-viewing-card">
            <div className="card-header">
              <h3>View Stats</h3>
            </div>
            <div className="card-content">
              <div className="stats-info">
                <h2>12</h2>
                <p>Patients seen today</p>
              </div>
              <div className="stats-info">
                <h2>5</h2>
                <p>Appointments pending</p>
              </div>
            </div>
          </div>
         {/* Manage Appointments Card */}
<div className="dashboard-card manage-appointments-card">
  <div className="card-header">
    <h3>Manage Appointments</h3>
    <span className="view-all" onClick={() => navigate("/manageappointments")}>View All</span>
  </div>
  <div className="card-content">
    <div className="appointment-count">
      <FaCalendarAlt className="card-icon pulse" />
      <h2>3</h2>
    </div>
    <div className="next-appointment">
      <p className="appointment-date">Next: 11:30 AM</p>
      <p className="appointment-doctor">Jane Smith - Consultation</p>
    </div>
  </div>
</div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DoctorDashboard;
