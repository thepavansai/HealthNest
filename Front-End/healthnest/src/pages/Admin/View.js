import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaTrash, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './View.css';
import Header from '../../components/Header';
import { BASE_URL } from '../../config/apiConfig';
import Footer from '../../components/Footer';

const View = () => {
  const [appointments, setAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const navigate = useNavigate();

  // Get auth header for API requests
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    // Check if user is logged in as admin
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'ADMIN') {
      navigate('/login');
      return;
    }

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/admin/appointments`, getAuthHeader());
        const allAppointments = response.data;
        
        console.log("All appointments:", allAppointments); // Debug log
        
        // Filter appointments by status - check both status and appointmentStatus fields
        const completed = allAppointments.filter(app => 
          (app.appointmentStatus && app.appointmentStatus.toLowerCase() === 'completed') || 
          (app.status && app.status.toLowerCase() === 'completed') ||
          (app.appointmentStatus && app.appointmentStatus.toLowerCase() === 'reviewed') ||
          (app.status && app.status.toLowerCase() === 'reviewed')
        );
        
        const pending = allAppointments.filter(app => 
          (app.appointmentStatus && app.appointmentStatus.toLowerCase() === 'pending') ||
          (app.status && app.status.toLowerCase() === 'pending')
        );
        
        const upcoming = allAppointments.filter(app => 
          (app.appointmentStatus && app.appointmentStatus.toLowerCase() === 'upcoming') ||
          (app.status && app.status.toLowerCase() === 'upcoming')
        );
        
        const cancelled = allAppointments.filter(app => 
          (app.appointmentStatus && app.appointmentStatus.toLowerCase() === 'cancelled') ||
          (app.status && app.status.toLowerCase() === 'cancelled')
        );
        
        // Set all the filtered appointment arrays
        setAppointments(allAppointments);
        setPendingAppointments(pending);
        setCompletedAppointments(completed);
        setUpcomingAppointments(upcoming);
        setCancelledAppointments(cancelled);
        setTotalAppointments(allAppointments.length);
        
        console.log("Completed:", completed.length);
        console.log("Pending:", pending.length);
        console.log("Upcoming:", upcoming.length);
        console.log("Cancelled:", cancelled.length);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to fetch appointments. Please try again later.');
        setLoading(false);
        
        // If unauthorized, redirect to login
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.clear();
          navigate('/login');
        }
      }
    };

    fetchAppointments();
  }, [navigate]);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    try {
      return new Date(dateTimeString).toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateTimeString;
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`http://localhost:8080/admin/appointments/${appointmentId}`, getAuthHeader());
        // Update the appointments list after successful deletion
        const updatedAppointments = appointments.filter(app => app.appointmentId !== appointmentId);
        setAppointments(updatedAppointments);
        setTotalAppointments(totalAppointments - 1);
        
        // Also update the filtered lists
        setPendingAppointments(pendingAppointments.filter(app => app.appointmentId !== appointmentId));
        setUpcomingAppointments(upcomingAppointments.filter(app => app.appointmentId !== appointmentId));
        setCancelledAppointments(cancelledAppointments.filter(app => app.appointmentId !== appointmentId));
        setCompletedAppointments(completedAppointments.filter(app => app.appointmentId !== appointmentId));
        
        alert('Appointment deleted successfully!');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Failed to delete appointment. Please try again.');
        
        // If unauthorized, redirect to login
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.clear();
          navigate('/login');
        }
      }
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading appointments data...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="error-container">
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="view-appointments-container">
        <header className="appointments-header">
          <h1>Appointments Dashboard</h1>
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-icon">
                <FaCalendarAlt />
              </div>
              <div className="summary-content">
                <div className="count">{totalAppointments}</div>
                <h2>Total Appointments</h2>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">
                <FaCheckCircle style={{ color: 'green' }} />
              </div>
              <div className="summary-content">
                <div className="count">{completedAppointments.length}</div>
                <h2>Completed</h2>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">
                <FaClock style={{ color: 'orange' }} />
              </div>
              <div className="summary-content">
                <div className="count">{pendingAppointments.length}</div>
                <h2>Pending</h2>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">
                <FaCalendarAlt style={{ color: 'blue' }} />
              </div>
              <div className="summary-content">
                <div className="count">{upcomingAppointments.length}</div>
                <h2>Upcoming</h2>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">
                <FaTimesCircle style={{ color: 'red' }} />
              </div>
              <div className="summary-content">
                <div className="count">{cancelledAppointments.length}</div>
                <h2>Cancelled</h2>
              </div>
            </div>
          </div>
        </header>
        
        <section className="current-appointments">
          <h2>Pending & Upcoming Appointments</h2>
          {pendingAppointments.length === 0 && upcomingAppointments.length === 0 ? (
            <p className="no-data-message">No pending or upcoming appointments found.</p>
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
                    
                  </tr>
                </thead>
                <tbody>
                  {[...pendingAppointments, ...upcomingAppointments].map(appointment => (
                    <tr key={appointment.appointmentId}>
                      <td>{appointment.userName || 'Unknown'}</td>
                      <td>{appointment.doctorName || 'Unknown'}</td>
                      <td>{appointment.doctorSpecialization || 'N/A'}</td>
                      <td>{formatDateTime(appointment.appointmentDate)}</td>
                      <td>
                        <span className={`status-badge ${appointment.appointmentStatus?.toLowerCase() || appointment.status?.toLowerCase() || 'unknown'}`}>
                          {(appointment.appointmentStatus || appointment.status || 'Unknown').charAt(0).toUpperCase() + 
                           (appointment.appointmentStatus || appointment.status || 'Unknown').slice(1)}
                        </span>
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
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedAppointments.map(appointment => (
                    <tr key={appointment.appointmentId}>
                      <td>{appointment.userName || 'Unknown'}</td>
                      <td>{appointment.doctorName || 'Unknown'}</td>
                      <td>{appointment.doctorSpecialization || 'N/A'}</td>
                      <td>{formatDateTime(appointment.appointmentDate)}</td>
                      <td>
                        <span className="status-badge completed">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        
        <section className="cancelled-appointments">
          <h2>Cancelled Appointments</h2>
          {cancelledAppointments.length === 0 ? (
            <p className="no-data-message">No cancelled appointments found.</p>
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
                   
                  </tr>
                </thead>
                <tbody>
                  {cancelledAppointments.map(appointment => (
                    <tr key={appointment.appointmentId}>
                      <td>{appointment.userName || 'Unknown'}</td>
                      <td>{appointment.doctorName || 'Unknown'}</td>
                      <td>{appointment.doctorSpecialization || 'N/A'}</td>
                      <td>{formatDateTime(appointment.appointmentDate)}</td>
                      <td>
                        <span className="status-badge cancelled">
                          Cancelled
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
      <Footer />
    </>
  );
};

export default View;
