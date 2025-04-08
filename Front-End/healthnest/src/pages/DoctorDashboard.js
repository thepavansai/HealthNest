

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './DoctorDashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const pieData = {
    labels: ['New Patients', 'Old Patients', 'Total Patients'],
    datasets: [
      {
        label: 'Patient Summary',
        data: [40, 60, 100],
        backgroundColor: ['#2980b9', '#f39c12', '#8e44ad'],
        borderWidth: 1,
      },
    ],
  };

  const appointments = [
    { name: 'M.J. Mical', diagnosis: 'Health Checkup', time: 'On Going' },
    { name: 'Sanath Deo', diagnosis: 'Health Checkup', time: '12:30 PM' },
    { name: 'Loeara Phanj', diagnosis: 'Report', time: '01:00 PM' },
    { name: 'Komola Haris', diagnosis: 'Common Cold', time: '01:30 PM' },
  ];

  return (
    <div>
      <Header />
      <div className="doctor-dashboard">
        <div className="hero-banner">
          <h1 className="hero-text">Welcome back, Dr. Alex Parker</h1>
          <p className="hero-subtext">Your personalized dashboard at a glance</p>
        </div>

        <div className="dashboard-content">
          {/* Profile */}
          <div className="dashboard-card text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3870/3870822.png"
              alt="Doctor Avatar"
              className="profile-image"
            />
            <h5 className="mt-2">Dr. Alex Parker</h5>
            <span className="badge bg-primary">Cardiologist</span>
            <p className="text-muted small">alex.parker@healthcare.com</p>
          </div>

          {/* Summary Cards */}
          <div className="dashboard-card">
            <h3 className="text-primary">068</h3>
            <p>Today Patients</p>
          </div>
          <div className="dashboard-card">
            <h3 className="text-success">085</h3>
            <p>Today Appointments</p>
          </div>

          {/* Pie Chart */}
          <div className="dashboard-card">
            <h5>Patient Summary</h5>
            <Pie data={pieData} />
          </div>

          {/* Today's Appointments */}
          <div className="dashboard-card">
            <h5 className="mb-3">Today Appointments</h5>
            <ul className="appointments-list">
              {appointments.map((a, idx) => (
                <li key={idx}>
                  <strong>{a.name}</strong> - {a.diagnosis}
                  <span className="float-end text-muted">{a.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Next Patient Details */}
          <div className="dashboard-card">
            <h5>Next Patient</h5>
            <p><strong>Sanath Deo</strong></p>
            <small>ID: 029000220005</small>
            <p>DOB: 15 Jan 1989</p>
            <p>Sex: Male | Height: 172 cm</p>
            <p>Last Visit: 15 Dec 2021</p>
            <div className="tags">
              <span className="tag bg-warning">Asthma</span>
              <span className="tag bg-info">Hypertension</span>
              <span className="tag bg-danger">Fever</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <h5>Quick Actions</h5>
            <div className="btn-group flex-wrap mt-2">
              <button className="btn btn-outline-primary" onClick={() => navigate('/manageappointments')}>
                Manage Appointments
              </button>
              <button className="btn btn-outline-primary" onClick={() => navigate('/doctorprofile')}>
                View Profile
              </button>
              <button className="btn btn-outline-success" onClick={() => navigate('/changepassword')}>
                Change Password
              </button>
              <button className="btn btn-outline-danger" onClick={() => navigate('/deleteaccount')}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
