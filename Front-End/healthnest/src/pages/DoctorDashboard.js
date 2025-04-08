import React from 'react';
import './DoctorDashboard.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DoctorDashboard = () => {
  const upcomingPatients = [
    { id: 1, name: 'Alice Smith', time: '10:00 AM', date: '2025-04-09' },
    { id: 2, name: 'Bob Johnson', time: '11:30 AM', date: '2025-04-09' },
  ];

  const totalConsultations = 5;
  const names="doctor";

  return (
    
    <div>
      <Header name={names}/>
      <div className="container mt-4 doctor-dashboard-container">
        {/* Welcome Bar */}
        <div className="welcome-bar mb-4">
          <h2>Welcome, Dr. John Doe 👋</h2>
          <p>Here’s what’s on your schedule today.</p>
        </div>

        <div className="row">
          {/* Sidebar */}
          <div className="col-md-4">
            <div className="card shadow-sm doctor-profile-card">
              <div className="card-body text-center">
                <img
                  src="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
                  alt="Doctor"
                  className="rounded-circle mb-3 doctor-avatar"
                />
                <h4 className="doctor-name">Dr. John Doe</h4>
                <p className="text-muted">Cardiologist</p>
              </div>
              <hr />
              <div className="quick-actions p-3">
                <h5 className="mb-3">Quick Actions</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <a href="/changepassword">🔒 Change Password</a>
                  </li>
                  <li className="list-group-item">
                    <a href="/deleteaccount">🗑️ Delete Account</a>
                  </li>
                  <li className="list-group-item">
                    <a href="/manageappointments">📅 Manage Appointments</a>
                  </li>
                  <li className="list-group-item">
                    <a href="/doctorprofile">🧑‍⚕️ Edit Profile</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-8">
            {/* Stats Cards */}
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="stats-card">
                  <h3>{upcomingPatients.length}</h3>
                  <p>Upcoming Appointments</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="stats-card">
                  <h3>{totalConsultations}</h3>
                  <p>Total Consultations</p>
                </div>
              </div>
            </div>

            {/* Upcoming Patients */}
            <div className="card shadow-sm upcoming-patients-card">
              <div className="card-body">
                <h4 className="mb-4">View Appointments</h4>
                {upcomingPatients.length > 0 ? (
                  <ul className="list-group">
                    {upcomingPatients.map((patient) => (
                      <li key={patient.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">{patient.name}</h6>
                          <small className="text-muted">{patient.date} • {patient.time}</small>
                        </div>
                        <span className="badge bg-primary">Scheduled</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No upcoming appointments.</p>
                )}
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
