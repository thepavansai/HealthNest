import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './View.css';

const View = () => {
  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAppointments, setTotalAppointments] = useState(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get('http://localhost:8080/admin/appointments');
        const allAppointments = response.data;
        
        // Filter completed and pending appointments
        const completed = allAppointments.filter(app => app.status === 'completed');
        const pending = allAppointments.filter(app => app.status !== 'completed');
        
        setAppointments(pending);
        setCompletedAppointments(completed);
        setTotalAppointments(allAppointments.length);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch appointments. Please try again later.');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return <div className="loading-container"><div className="loader"></div></div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="view-appointments-container">
      <header className="appointments-header">
        <h1>Appointments Dashboard</h1>
        <div className="appointments-summary">
          <div className="summary-card">
            <h2>Total Appointments</h2>
            <span className="count">{totalAppointments}</span>
          </div>
          <div className="summary-card">
            <h2>Pending</h2>
            <span className="count">{appointments.length}</span>
          </div>
          <div className="summary-card">
            <h2>Completed</h2>
            <span className="count">{completedAppointments.length}</span>
          </div>
        </div>
      </header>

      <section className="current-appointments">
        <h2>Current Appointments</h2>
        {appointments.length === 0 ? (
          <p className="no-data-message">No pending appointments found.</p>
        ) : (
          <div className="appointments-table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>{appointment.patientName}</td>
                    <td>Dr. {appointment.doctorName}</td>
                    <td>{appointment.specialization}</td>
                    <td>{formatDateTime(appointment.appointmentDateTime)}</td>
                    <td>
                    <span className={`status-badge ${appointment.status || 'unknown'}`}>
                   {appointment.status ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1): 'Unknown'}
</span>

                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn cancel">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="completed-appointments">
        <h2>Completed Appointments</h2>
        {completedAppointments.length === 0 ? (
          <p className="no-data-message">No completed appointments found.</p>
        ) : (
          <div className="appointments-table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Date & Time</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedAppointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>{appointment.patientName}</td>
                    <td>Dr. {appointment.doctorName}</td>
                    <td>{appointment.specialization}</td>
                    <td>{formatDateTime(appointment.appointmentDateTime)}</td>
                    <td>₹{appointment.paymentAmount}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view">View Details</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default View;