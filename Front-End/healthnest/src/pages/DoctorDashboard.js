import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div className="doctor-dashboard">
        {/* Hero Section */}
        <div className="hero-banner">
          <div className="overlay">
            <h1 className="hero-text">Welcome back, Dr. Alex Parker</h1>
            <p className="hero-subtext">Your personalized dashboard at a glance.</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mt-5">
          <div className="row g-4">
            {/* Profile Overview */}
            <div className="col-md-4">
              <div className="appointment-card profile-overview text-center p-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3870/3870822.png"
                  alt="Doctor Avatar"
                  className="rounded-circle mb-3"
                />
                <h5 className="card-title mb-1">Dr. Alex Parker</h5>
                <span className="badge bg-primary">Cardiologist</span>
                <p className="text-muted mt-2 small">alex.parker@healthcare.com</p>
              </div>
            </div>

            {/* Stats + Quick Actions */}
            <div className="col-md-8">
              <div className="row mb-4">
                <div className="col-sm-6 mb-3">
                  <div className="appointment-card text-center py-4">
                    <h3 className="text-primary mb-1">4</h3>
                    <p className="mb-0">Upcoming Appointments</p>
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="appointment-card text-center py-4">
                    <h3 className="text-success mb-1">27</h3>
                    <p className="mb-0">Total Patients</p>
                  </div>
                </div>
              </div>

              <div className="appointment-card p-4">
                <h5 className="mb-3 card-title">Quick Actions</h5>
                <div className="btn-group flex-wrap">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/manageappointments')}
                  >
                    Manage Appointments
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/doctorprofile')}
                  >
                    View Profile
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => navigate('/changepassword')}
                  >
                    Change Password
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => navigate('/deleteaccount')}
                  >
                    Delete Account
                  </button>
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

export default DoctorDashboard;
