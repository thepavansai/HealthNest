import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { FaCalendarCheck, FaComments, FaUserMd, FaUsers } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { RiAdminLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    totalConsultations: 0,
    totalDoctors: 0,
    totalPatients: 0,
  });
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 16) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const fetchDashboardData = async () => {
      try {
        const [appointmentsResponse, doctorsResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:8080/admin/appointments'),
          axios.get('http://localhost:8080/admin/doctors'),
          axios.get('http://localhost:8080/admin/users'),
        ]);

        const totalConsultations = appointmentsResponse.data.length;
        const totalDoctors = doctorsResponse.data.filter(doctor => doctor.status === 1).length;
        const totalPatients = usersResponse.data.filter(user => user.role === 'users').length;

        setStats({
          totalConsultations,
          totalDoctors,
          totalPatients,
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleFeedback = () => {
    navigate('feedback');
  };

  const handleManageDoctors = () => {
    navigate('doctors');
  };

  const handleViewAppointments = () => {
    navigate('appointments');
  };

  const handleManageUsers = () => {
    navigate('users');
  };

  return (
    <div className="admin-dashboard-container">
      <Header />

      <div className="admin-dashboard">
        <div className="admin-hero-section">
          <div className="admin-hero-content">
            <h1>
              <span className="greeting">{greeting},</span>
              <span className="admin-name">Admin</span>
            </h1>
            <p className="admin-hero-subtitle">
              Welcome to your dashboard. Here's an overview of your health system.
            </p>
          </div>
        </div>

        <div className="admin-dashboard-content">
          <div className="admin-sidebar">
            <div className="admin-profile">
              <div className="admin-avatar-container">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="Admin Avatar"
                  className="admin-avatar"
                />
                <span className="admin-status-indicator"></span>
              </div>
              <div className="admin-info">
                <h3>Admin</h3>
                <p className="admin-email">admin@healthnest.com</p>
                <span className="admin-role">
                  <RiAdminLine /> Administrator
                </span>
              </div>
              <div className="admin-dropdown">
                <button onClick={toggleDropdown} className="admin-profile-button">
                  Options
                </button>
                {dropdownOpen && (
                  <div className="admin-dropdown-menu">
                    <button className="admin-dropdown-item admin-logout" onClick={handleLogout}>
                      <BiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="admin-main-content">
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-icon consultations">
                  <MdDashboard />
                </div>
                <div className="admin-stat-details">
                  <h3>{stats.totalConsultations}</h3>
                  <p>Total Consultations</p>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon doctors">
                  <FaUserMd />
                </div>
                <div className="admin-stat-details">
                  <h3>{stats.totalDoctors}</h3>
                  <p>Doctors</p>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon patients">
                  <FaUsers />
                </div>
                <div className="admin-stat-details">
                  <h3>{stats.totalPatients}</h3>
                  <p>Patients</p>
                </div>
              </div>
            </div>

            <div className="admin-actions-section">
              <h2>Quick Actions</h2>
              <div className="admin-actions-grid">
                <div className="admin-action-card" onClick={handleManageDoctors}>
                  <div className="admin-action-icon">
                    <FaUserMd />
                  </div>
                  <h3>Manage Doctors</h3>
                  <p>Add, update or remove doctors</p>
                </div>

                <div className="admin-action-card" onClick={handleViewAppointments}>
                  <div className="admin-action-icon">
                    <FaCalendarCheck />
                  </div>
                  <h3>View Appointments</h3>
                  <p>Check all scheduled appointments</p>
                </div>

                <div className="admin-action-card" onClick={handleManageUsers}>
                  <div className="admin-action-icon">
                    <FaUsers />
                  </div>
                  <h3>Manage Users</h3>
                  <p>View and manage patient accounts</p>
                </div>

                <div className="admin-action-card" onClick={handleFeedback}>
                  <div className="admin-action-icon">
                    <FaComments />
                  </div>
                  <h3>View Feedbacks</h3>
                  <p>Review patient feedback and ratings</p>
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