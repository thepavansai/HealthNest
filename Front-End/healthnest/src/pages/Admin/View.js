import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
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
        const response = await axios.get('http://localhost:8080/admin/appointments');
        const allAppointments = response.data;
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

  const handleDeleteAll = () => {
    const confirmed = window.confirm("Are you sure, do you want delete all the records?");
    if (confirmed) {
      fetch("http://localhost:8080/admin/appointments/delete", { method: "DELETE" })
        .then((res) => {
          if (res.ok) {
            setAppointments([]);
            setCompletedAppointments([]);
            setTotalAppointments(0);
            alert("All appointments deleted successfully.");
          } else {
            alert("Failed to delete appointments.");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("An error occurred.");
        });
    }
  };

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
        <div className="summary-card">
  <div className="summary-icon">
    <FaCalendarAlt />
  </div>
  <div className="summary-content">
    <div className="count">{totalAppointments}</div>
    <h2>Total Appointments</h2>
  </div>
</div>

      </header>

      <section className="current-appointments">
        <h2>Total Appointments</h2>
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
                    <td>{appointment.userName}</td>
                    <td>{appointment.doctorName}</td>
                    <td>{appointment.doctorSpecialization}</td>
                    <td>{formatDateTime(appointment.appointmentDate)}</td>
                    <td>
                      <span className={`status-badge ${appointment.appointmentStatus || 'unknown'}`}>
                        {appointment.status ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) : 'Unknown'}
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
            <div className="delete-all-container">
              <button className="delete-all-button" onClick={handleDeleteAll}>
                Delete All
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default View;