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
  const [loading, setLoading] = useState(true);

  const doctorId = localStorage.getItem("doctorId");
  console.log(doctorId)

  useEffect(() => {
    if (doctorId) {
      axios.get(`http://localhost:8080/doctor/profile/${doctorId}`)
        .then(res => {
          setDoctorData(res.data || {});
          console.log(res.data)
        })
        .catch(err => {
          console.error("Error fetching doctor profile:", err);
        })
        .finally(() => setLoading(false));
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
      <DoctorHeader></DoctorHeader>

      <main className="doctor-dashboard-container">
        { }
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome back, {doctorData.doctorName || 'Doctor'} 👋</h1>
            <p className="subtitle">Here’s what’s happening with your practice today.</p>
          </div>

          <div className="profile-widget">
            <div className="profile-info" onClick={toggleDropdown}>
              <div className="profile-avatar">
                <img
                  src={doctorData.profileImage || "/doctor-avatar.jpg"}
                  alt="Doctor Avatar"
                />
              </div>
              <span className="profile-name">Dr. {doctorData.name}</span>
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
              <h3>View Appointments</h3>
              <span className="view-all">View All</span>
            </div>
            <div className="card-content">
              <div className="appointment-count">
                <FaCalendarAlt className="card-icon pulse" />
                <h2>8</h2>
              </div>
              <div className="next-appointment">
                <p className="appointment-date">Next: 10:30 AM</p>
                <p className="appointment-doctor">John Doe - Chest Pain</p>
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
