import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import './View.css';
import Header from '../../components/Header';
import { BASE_URL } from '../../config/apiConfig';
import Footer from '../../components/Footer';

const View = () => {
  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAppointments, setTotalAppointments] = useState(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/appointments`);
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

  return (<>
    <Header></Header>
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
                  <tr key={appointment.appointmentId}>
                    <td>{appointment.userName}</td>
                    <td>{appointment.doctorName}</td>
                    <td>{appointment.doctorSpecialization}</td>
                    <td>{formatDateTime(appointment.appointmentDate)}</td>
                    <td>
                      <span className={`status-badge ${appointment.appointmentStatus || 'unknown'}`}>
                        {appointment.appointmentStatus ? appointment.appointmentStatus.charAt(0).toUpperCase() + appointment.appointmentStatus.slice(1) : 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      
    </div>
    <Footer></Footer>
    </>
  );
};

export default View;