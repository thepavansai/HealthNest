import axios from 'axios';
import { BASE_URL } from '../../config/apiConfig';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCalendarCheck, FaCheckCircle, FaSearch, FaClock } from 'react-icons/fa';
import './DoctorViewAppointments.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const DoctorViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorId) {
        console.error("Doctor ID not found.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        // Make the request with the Authorization header
        const response = await axios.get(
          `${BASE_URL}/appointments/doctor/${localStorage.getItem('doctorId')}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Create fetchedAppointments with string IDs
        const fetchedAppointments = response.data.map(app => ({
          ...app,
          appointmentId: String(app.appointmentId),
          userId: app.userId ? String(app.userId) : undefined
        }));
        
        setAppointments(fetchedAppointments);
        setCompletedAppointments(fetchedAppointments.filter(appointment => {
          const status = appointment.appointmentStatus.toLowerCase();
          return status === 'completed' || status === 'reviewed';
        }));
        setUpcomingAppointments(fetchedAppointments.filter(
          appointment => appointment.appointmentStatus.toLowerCase() === 'upcoming'
        ));
        setCancelledAppointments(fetchedAppointments.filter(
          appointment => appointment.appointmentStatus.toLowerCase() === 'cancelled'
        ));
        setPendingAppointments(fetchedAppointments.filter(
          appointment => appointment.appointmentStatus.toLowerCase() === 'pending'
        ));

      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAppointments();
  }, [doctorId]);
  

  const filteredAppointments = appointments.filter(appointment => {
    const searchText = searchTerm.toLowerCase();
    const matchesSearch =
      (appointment.userName?.toLowerCase() || '').includes(searchText) ||
      (appointment.description?.toLowerCase() || '').includes(searchText);

    const status = appointment.appointmentStatus?.toLowerCase() || '';
    let matchesStatus = false;
    if (filterStatus === 'all') {
      matchesStatus = true;
    } else if (filterStatus === 'completed') {
      // For the Completed filter, include both "completed" and "reviewed"
      matchesStatus = (status === 'completed' || status === 'reviewed');
    } else {
      matchesStatus = status === filterStatus.toLowerCase();
    }

    return matchesSearch && matchesStatus;
  });

  const handleAppointmentAction = async (appointmentId, action) => {
    if (!doctorId) {
        alert("Doctor ID not found. Please login again.");
        return;
    }
    try {
      const token = localStorage.getItem('token');
      const doctorId = localStorage.getItem('doctorId');
      
      // Ensure doctorId is the correct type
      const response = await axios.post(
        `${BASE_URL}/appointments/${appointmentId}/${action}/${doctorId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 200) {
        setAppointments(prev =>
          prev.map(app =>
            app.appointmentId === String(appointmentId)
              ? { ...app, appointmentStatus: action === 'accept' ? 'Upcoming' : 'Cancelled' }
              : app
          )
        );
        alert(`Appointment ${action}ed successfully.`);
      } else {
        alert(`Failed to ${action} appointment.`);
      }
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
      alert(`Error ${action}ing appointment. Please try again later.`);
    }
  };
  
  const cancelAppointment = async (appointmentId, appointmentDate, appointmentTime) => {
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    const currentTime = new Date();
    if (appointmentDateTime < currentTime) {
      alert('You cannot cancel an appointment that has already passed.');
      return;
    }
    const timeDifferenceInMilliseconds = appointmentDateTime - currentTime;
    const timeDifferenceInHours = timeDifferenceInMilliseconds / (1000 * 3600);
    if (timeDifferenceInHours < 3) {
      alert('You cannot cancel an appointment less than 3 hours before it starts.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${BASE_URL}/appointments/${appointmentId}/status/Cancelled`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (response.status === 200) {
        setAppointments(prev =>
          prev.map(app =>
            app.appointmentId === String(appointmentId)
              ? { ...app, appointmentStatus: 'Cancelled' }
              : app
          )
        );
        alert('Appointment cancelled successfully.');
      } else {
        alert('Failed to cancel appointment.');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Error cancelling appointment. Please try again later.');
    }
  };
  
  const markAsCompleted = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
  

      const response = await axios.patch(
        `${BASE_URL}/appointments/${appointmentId}/status/Completed`,
        {}, // Empty body
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setAppointments(prev =>
          prev.map(app =>
            app.appointmentId === String(appointmentId)
              ? { ...app, appointmentStatus: 'Completed' }
              : app
          )
        );
        alert('Appointment marked as completed.');
      } else {
        // This part might not be reached if axios throws for non-2xx status
        alert(`Failed to mark appointment as completed. Status: ${response.status}`);
        console.error('Mark as completed failed with status:', response.status, response.data);
      }
    } catch (error) {
      console.error('Error marking appointment as completed:', error); // Log the full error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error Data:', error.response.data);
        console.error('Error Status:', error.response.status);
        console.error('Error Headers:', error.response.headers);
        // Provide more specific feedback if possible
        const errorMsg = error.response.data?.message || error.response.data || `Server responded with ${error.response.status}`;
        alert(`Error marking appointment as completed: ${errorMsg}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error Request:', error.request);
        alert('Error marking appointment as completed: No response from server.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error Message:', error.message);
        alert(`Error marking appointment as completed: ${error.message}`);
      }
    }
  };
  
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'upcoming': return 'status-upcoming';
      case 'cancelled': return 'status-cancelled';
      case 'pending': return 'status-pending';
      case 'reviewed': return 'status-reviewed'; 
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="doctor-loading-container">
        <div className="doctor-spinner"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (<>
  <Header></Header>
    <div className="doctor-view-appointments-container">
      <div className="doctor-appointments-header">
        <h1>Appointments Dashboard</h1>
        <div className="doctor-appointments-summary">
          <div className="doctor-summary-card">
            <div className="doctor-summary-icon">
              <FaCalendarAlt />
            </div>
            <div className="doctor-summary-details">
              <h3>{appointments.length}</h3>
              <p>Total Appointments</p>
            </div>
          </div>

          <div className="doctor-summary-card">
            <div className="doctor-summary-icon doctor-pending-icon">
              <FaClock />
            </div>
            <div className="doctor-summary-details pending-details">
              <h3>{pendingAppointments.length}</h3>
              <p>Pending Appointments</p>
            </div>
          </div>

          <div className="doctor-summary-card">
            <div className="doctor-summary-icon doctor-upcoming-icon">
              <FaCalendarAlt />
            </div>
            <div className="doctor-summary-details">
              <h3>{upcomingAppointments.length}</h3>
              <p>Upcoming Appointments</p>
            </div>
          </div>

          <div className="doctor-summary-card">
            <div className="doctor-summary-icon doctor-completed-icon">
              <FaCalendarCheck />
            </div>
            <div className="doctor-summary-details">
              <h3>{completedAppointments.length}</h3>
              <p>Completed Appointments</p>
            </div>
          </div>

          <div className="doctor-summary-card">
            <div className="doctor-summary-icon doctor-cancelled-icon">
              <FaCalendarAlt />
            </div>
            <div className="doctor-summary-details">
              <h3>{cancelledAppointments.length}</h3>
              <p>Cancelled Appointments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="doctor-appointments-filter">
        <div className="doctor-search-container">
          <FaSearch className="doctor-search-icon" />
          <input
            type="text"
            placeholder="Search by doctor or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="doctor-filter-buttons">
          <button
            className={filterStatus === 'all' ? 'active' : ''}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button
            className={filterStatus === 'pending' ? 'active' : ''}
            onClick={() => setFilterStatus('pending')}
          >
            Pending
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

      <div className="doctor-appointments-section">
      <h2>{filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Appointments</h2>
        {filteredAppointments.length === 0 ? (
          <div className="doctor-no-appointments">
            <p>No appointments found matching your criteria</p>
          </div>
        ) : (
          <div className="doctor-appointments-table-container">
            <table className="doctor-appointments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient Name</th>
                  <th>Description</th>
                  <th>Date & Time</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(appointment => (
                  <tr key={appointment.appointmentId}>
                    <td data-label="ID" >{appointment.appointmentId}</td>
                    <td data-label="Patient Name">{appointment.userName}</td>
                    <td data-label="Description" >{appointment.description}</td>
                    <td data-label="Date & Time" >
                      <div className="doctor-appointment-time">
                        <div>{new Date(appointment.appointmentDate).toLocaleDateString()}</div>
                        <span>{appointment.appointmentTime}</span>
                      </div>
                    </td>
                    <td data-label="Phone Number" >+91-{appointment.userPhoneNo}</td>
                    <td data-label="Status">
                      <span className={`doctor-status-badge doctor-status-${appointment.appointmentStatus.toLowerCase()}`}>
                        {appointment.appointmentStatus}
                      </span>
                    </td>
                    <td data-label="Actions" >
                      <div className="doctor-action-buttons">
                        {appointment.appointmentStatus.toLowerCase() === 'pending' && (
                          <>
                            <button
                              className="doctor-accept-btn"
                              onClick={() => handleAppointmentAction(String(appointment.appointmentId), 'accept')}
                            >
                              Accept
                            </button>
                            <button
                              className="doctor-reject-btn"
                              onClick={() => cancelAppointment(
                                String(appointment.appointmentId),
                                appointment.appointmentDate,
                                appointment.appointmentTime
                              )}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {appointment.appointmentStatus.toLowerCase() === 'upcoming' && (
                          <>
                            <button
                              className="doctor-cancel-btn"
                              onClick={() =>
                                cancelAppointment(
                                  String(appointment.appointmentId),
                                  appointment.appointmentDate,
                                  appointment.appointmentTime
                                )
                              }
                            >
                              Cancel
                            </button>
                            <button
                              className="doctor-complete-btn"
                              onClick={() => markAsCompleted(String(appointment.appointmentId))}
                            >
                              Complete
                            </button>
                          </>
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

      <div className="doctor-appointments-section doctor-completed-section">
        <h2>Completed Appointments</h2>
        {completedAppointments.length === 0 ? (
          <div className="doctor-no-appointments">
            <p>No completed appointments yet</p>
          </div>
        ) : (
          <div className="doctor-completed-appointments">
            {completedAppointments.slice(0, 5).map(appointment => (
              <div className="doctor-completed-card" key={appointment.appointmentId}>
                <div className="doctor-completed-header">
                  <FaCheckCircle className="doctor-completed-icon" />
                  <div className="doctor-completed-date">
                    {new Date(appointment.appointmentDate).toLocaleDateString()} | {appointment.appointmentTime}
                  </div>
                </div>
                <div className="doctor-completed-details">
                  <h4>{appointment.userName}</h4>
                  <p>Description: {appointment.description}</p>
                  <p>Date: {appointment.appointmentDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    <Footer></Footer>
 </> );
};

export default DoctorViewAppointments;