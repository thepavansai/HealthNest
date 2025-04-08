import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCalendarCheck, FaCheckCircle, FaSearch } from 'react-icons/fa';
import './ViewAppointments.css';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/users/appointments/${localStorage.getItem('userId')}`);
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);
  
  const completedAppointments = appointments.filter(
    appointment => appointment.appointmentStatus.toLowerCase() === 'completed'
  );
  
  const upcomingAppointments = appointments.filter(
    appointment => appointment.appointmentStatus.toLowerCase() === 'upcoming'
  );
  
  const cancelledAppointments = appointments.filter(
    appointment => appointment.appointmentStatus.toLowerCase() === 'cancelled'  
  );
  
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && appointment.appointmentStatus.toLowerCase() === filterStatus.toLowerCase();
  });
  

  const cancelAppointment = async (appointmentId, appointmentDate, appointmentTime) => {
    // Combine appointment date and time into a single Date object
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    const currentTime = new Date();

    // Check if the appointment has already passed
    if (appointmentDateTime < currentTime) {
        alert('You cannot cancel an appointment that has already passed.');
        return;
    }

    // Calculate the difference in milliseconds
    const timeDifferenceInMilliseconds = appointmentDateTime - currentTime;

    // Convert milliseconds to hours
    const timeDifferenceInHours = timeDifferenceInMilliseconds / (1000 * 3600);

    // Check if the appointment is less than 3 hours away
    if (timeDifferenceInHours < 3) {
        alert('You cannot cancel an appointment less than 3 hours before it starts.');
        return;
    }
    try {
      const response = await axios.patch(`http://localhost:8080/users/cancelappointment/${appointmentId}`);
      if (response.status === 200) {
        setAppointments(prevAppointments =>
          prevAppointments.map(appointment =>
            appointment.appointmentId === appointmentId
              ? { ...appointment, appointmentStatus: 'Cancelled' }
              : appointment
          )
        );
        alert('Appointment cancelled successfully!');
      } else {
        alert('Failed to cancel appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Error cancelling appointment. Please try again later.');
    }
  };
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed': return 'status-completed';
      case 'Upcoming': return 'status-upcoming';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }
  
  return (
    <div className="view-appointments-container">
      <div className="appointments-header">
        <h1>Appointments Dashboard</h1>
        <div className="appointments-summary">
          <div className="summary-card">
            <div className="summary-icon">
              <FaCalendarAlt />
            </div>
            <div className="summary-details">
              <h3>{appointments.length}</h3>
              <p>Total Appointments</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon pending-icon">
              <FaCalendarAlt />
            </div>
            <div className="summary-details">
              <h3>{upcomingAppointments.length}</h3>
              <p>Upcoming Appointments</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon completed-icon">
              <FaCalendarCheck />
            </div>
            <div className="summary-details">
              <h3>{completedAppointments.length}</h3>
              <p>Completed Appointments</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon cancelled-icon">
              <FaCalendarAlt />
            </div>
            <div className="summary-details">
              <h3>{cancelledAppointments.length}</h3>
              <p>Cancelled Appointments</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="appointments-filter">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by doctor or description" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-buttons">
          <button 
            className={filterStatus === 'all' ? 'active' : ''} 
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button 
            className={filterStatus === 'upcoming' ? 'active' : ''} 
            onClick={() => setFilterStatus('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={filterStatus === 'completed' ? 'active' : ''} 
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </button>
          <button 
            className={filterStatus === 'cancelled' ? 'active' : ''} 
            onClick={() => setFilterStatus('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>
      
      <div className="appointments-section">
        <h2>All Appointments</h2>
        {filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            <p>No appointments found matching your criteria</p>
          </div>
        ) : (
          <div className="appointments-table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Doctor</th>
                  <th>Hospital</th>
                  <th>Date & Time</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(appointment => (
                  <tr key={appointment.appointmentId}>
                    <td>{appointment.appointmentId}</td>
                    <td>Dr. {appointment.doctorName}</td>
                    <td>{appointment.hospitalName}</td>
                    <td>
                      <div className="appointment-time">
                        <div>{new Date(appointment.appointmentDate).toLocaleDateString()}</div>
                        <span>{appointment.appointmentTime}</span>
                      </div>
                    </td>
                    <td>₹{appointment.consultationFee}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(appointment.appointmentStatus)}`}>
                        {appointment.appointmentStatus}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {appointment.appointmentStatus.toLowerCase() === 'upcoming' && (
                          <button 
                            className="cancel-btn" 
                            onClick={() => cancelAppointment(appointment.appointmentId, appointment.appointmentDate, appointment.appointmentTime)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="appointments-section completed-section">
        <h2>Recently Completed Appointments</h2>
        {completedAppointments.length === 0 ? (
          <div className="no-appointments">
            <p>No completed appointments yet</p>
          </div>
        ) : (
          <div className="completed-appointments">
            {completedAppointments.slice(0, 5).map(appointment => (
              <div className="completed-card" key={appointment.appointmentId}>
                <div className="completed-header">
                  <FaCheckCircle className="completed-icon" />
                  <div className="completed-date">
                    {new Date(appointment.appointmentDate).toLocaleDateString()} | {appointment.appointmentTime}
                  </div>
                </div>
                <div className="completed-details">
                  <h4>#{appointment.appointmentId} - {appointment.doctorName}</h4>
                  <p>Hospital: {appointment.hospitalName}</p>
                  <p>Fee: ₹{appointment.consultationFee}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAppointments;