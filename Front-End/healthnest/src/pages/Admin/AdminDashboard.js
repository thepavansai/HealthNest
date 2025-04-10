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
    navigate('/admin/viewfeedbacks')
  }

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
      <Header/>
      <div className="admin-dashboard">
        <div className="hero-banner">
          <div className="overlay">
            <h1 className="hero-text">Welcome Admin</h1>
            <p className="hero-subtext">Manage the system with ease.</p>
          </div>
        </div>

        <div className="container mt-5">
          <div className="row g-4">
            {/* Admin Profile */}
            <div className="col-md-4">
              <div className="appointment-card profile-overview text-center p-4 position-relative">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="Admin Avatar"
                  className="rounded-circle mb-3"
                />
                <h5 className="card-title mb-1">Admin Name</h5>
                <span className="badge bg-primary">Administrator</span>
                <p className="text-muted mt-2 small">admin@healthnest.com</p>
                <div className="dropdown-container">
                  <button onClick={toggleDropdown} className="btn btn-outline-dark dropdown-toggle">
                    Profile
                  </button>
                  {dropdownOpen && (
                    <div className="dropdown-menu show">
                      
                      <button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="col-md-8">
              <div className="row mb-4">
                <div className="col-sm-12 mb-3">
                  <div className="appointment-card text-center py-4">
                    <h3 className="text-info mb-1">50</h3>
                    <p className="mb-0">Total Consultations</p>
                  </div>
                </div>
              </div>

              <div className="appointment-card p-4">
                <h5 className="mb-3 card-title">Quick Actions</h5>
                <div className="btn-group flex-wrap">
                  <button className="btn btn-outline-primary" onClick={handleManageDoctors}>Manage Doctors</button>
                  <button className="btn btn-outline-success" onClick={handleViewAppointments}>View Appointments</button>
                  <button className="btn btn-outline-warning" onClick={handleManageUsers}>Manage Users</button>
                  <button className="btn btn-outline-primary" onClick={handleFeedback}>View Feedbacks</button>
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
