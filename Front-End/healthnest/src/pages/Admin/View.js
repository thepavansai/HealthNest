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

  // Update the loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="admin-view-loading">
          <div className="admin-view-spinner"></div>
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
        <div className="admin-view-container">
          <div className="admin-view-error">
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
      <div className="admin-view-container">
        <header className="admin-view-header">
          <h1 className="admin-view-title">Appointments Dashboard</h1>
          <div className="admin-view-summary-cards">
            <div className="admin-view-summary-card total">
              <div className="admin-view-summary-icon total">
                <FaCalendarAlt />
              </div>
              <div className="admin-view-summary-content">
                <div className="admin-view-summary-count">{totalAppointments}</div>
                <h2 className="admin-view-summary-title">Total Appointments</h2>
              </div>
            </div>
            
            <div className="admin-view-summary-card completed">
              <div className="admin-view-summary-icon completed">
                <FaCheckCircle />
              </div>
              <div className="admin-view-summary-content">
                <div className="admin-view-summary-count">{completedAppointments.length}</div>
                <h2 className="admin-view-summary-title">Completed</h2>
              </div>
            </div>
            
            <div className="admin-view-summary-card pending">
              <div className="admin-view-summary-icon pending">
                <FaClock />
              </div>
              <div className="admin-view-summary-content">
                <div className="admin-view-summary-count">{pendingAppointments.length}</div>
                <h2 className="admin-view-summary-title">Pending</h2>
              </div>
            </div>
            
            <div className="admin-view-summary-card upcoming">
              <div className="admin-view-summary-icon upcoming">
                <FaCalendarAlt />
              </div>
              <div className="admin-view-summary-content">
                <div className="admin-view-summary-count">{upcomingAppointments.length}</div>
                <h2 className="admin-view-summary-title">Upcoming</h2>
              </div>
            </div>
            
            <div className="admin-view-summary-card cancelled">
              <div className="admin-view-summary-icon cancelled">
                <FaTimesCircle />
              </div>
              <div className="admin-view-summary-content">
                <div className="admin-view-summary-count">{cancelledAppointments.length}</div>
                <h2 className="admin-view-summary-title">Cancelled</h2>
              </div>
            </div>
          </div>
        </header>
        
        <section className="admin-view-section">
          <h2 className="admin-view-section-title">Pending & Upcoming Appointments</h2>
          {pendingAppointments.length === 0 && upcomingAppointments.length === 0 ? (
            <p className="admin-view-no-data">No pending or upcoming appointments found.</p>
          ) : (
            <div className="admin-view-table-container">
              <table className="admin-view-table">
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
                      <td data-label="Patient Name">{appointment.userName || 'Unknown'}</td>
                      <td data-label="Doctor">{appointment.doctorName || 'Unknown'}</td>
                      <td data-label="Specialization">{appointment.doctorSpecialization || 'N/A'}</td>
                      <td data-label="Date & Time">{formatDateTime(appointment.appointmentDate)}</td>
                      <td data-label="Status">
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
        
        <section className="admin-view-section">
          <h2 className="admin-view-section-title">Completed Appointments</h2>
          {completedAppointments.length === 0 ? (
            <p className="admin-view-no-data">No completed appointments found.</p>
          ) : (
            <div className="admin-view-table-container">
              <table className="admin-view-table">
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
                    <tr key={appointment.appointmentId || `completed-${Math.random()}`}>
                      <td data-label="Patient Name">{appointment.userName || 'Unknown'}</td>
                      <td data-label="Doctor">{appointment.doctorName || 'Unknown'}</td>
                      <td data-label="Specialization">{appointment.doctorSpecialization || 'N/A'}</td>
                      <td data-label="Date & Time">{formatDateTime(appointment.appointmentDate)}</td>
                      <td data-label="Status">
                        <span 
                          className={`status-badge ${
                            appointment.appointmentStatus?.toLowerCase() === 'completed' || 
                            appointment.status?.toLowerCase() === 'completed' ? 'completed' : 
                            appointment.appointmentStatus?.toLowerCase() === 'reviewed' || 
                            appointment.status?.toLowerCase() === 'reviewed' ? 'reviewed' : 
                            'completed'
                          }`}
                        >
                          {appointment.appointmentStatus === 'COMPLETED' || appointment.status === 'COMPLETED' ? 'Completed' :
                           appointment.appointmentStatus === 'REVIEWED' || appointment.status === 'REVIEWED' ? 'Reviewed' :
                           'Completed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        
        <section className="admin-view-section">
          <h2 className="admin-view-section-title">Cancelled Appointments</h2>
          {cancelledAppointments.length === 0 ? (
            <p className="admin-view-no-data">No cancelled appointments found.</p>
          ) : (
            <div className="admin-view-table-container">
              <table className="admin-view-table">
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
                      <td data-label="Patient Name">{appointment.userName || 'Unknown'}</td>
                      <td data-label="Doctor">{appointment.doctorName || 'Unknown'}</td>
                      <td data-label="Specialization">{appointment.doctorSpecialization || 'N/A'}</td>
                      <td data-label="Date & Time">{formatDateTime(appointment.appointmentDate)}</td>
                      <td data-label="Status">
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
      </div>
      <Footer />
    </>
  );
};

export default View;
