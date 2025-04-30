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
        const response = await axios.get(`${BASE_URL}/appointments/doctor/${doctorId}`);
        const fetchedAppointments = response.data.map(app => ({
          ...app,
          appointmentId: String(app.appointmentId),
          userId: String(app.userId)
        }));
        setAppointments(fetchedAppointments);

        setCompletedAppointments(fetchedAppointments.filter(
          appointment => appointment.appointmentStatus.toLowerCase() === 'completed' || appointment.appointmentStatus.toLowerCase() === 'reviewed'
        ));
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
    const matchesSearch =
      (appointment.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (appointment.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && (appointment.appointmentStatus?.toLowerCase() || '') === filterStatus.toLowerCase();
  });

  const handleAppointmentAction = async (appointmentId, action) => {
    if (!doctorId) {
        alert("Doctor ID not found. Please login again.");
        return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/appointments/${String(appointmentId)}/${action}/${doctorId}`
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
      const response = await axios.patch(`${BASE_URL}/users/cancelappointment/${String(appointmentId)}`);
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
      const response = await axios.patch(`${BASE_URL}/appointments/${String(appointmentId)}/status/Completed`);
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
        alert('Failed to mark appointment as completed.');
      }
    } catch (error) {
      console.error('Error marking appointment as completed:', error);
      alert('Error marking appointment as completed. Please try again later.');
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
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (<>
  <Header></Header>
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
              <FaClock />
            </div>
            <div className="summary-details pending-details">
              <h3>{pendingAppointments.length}</h3>
              <p>Pending Appointments</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon upcoming-icon">
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

      <div className="appointments-section">
      <h2>{filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Appointments</h2>
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
                    <td>{appointment.appointmentId}</td>
                    <td>{appointment.userName}</td>
                    <td>{appointment.description}</td>
                    <td>
                      <div className="appointment-time">
                        <div>{new Date(appointment.appointmentDate).toLocaleDateString()}</div>
                        <span>{appointment.appointmentTime}</span>
                      </div>
                    </td>
                    <td>+91-{appointment.userPhoneNo}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(appointment.appointmentStatus)}`}>
                        {appointment.appointmentStatus}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {appointment.appointmentStatus.toLowerCase() === 'pending' && (
                          <>
                            <button
                              className="accept-btn"
                              onClick={() => handleAppointmentAction(String(appointment.appointmentId), 'accept')}
                            >
                              Accept
                            </button>
                            <button
                              className="reject-btn"
                              onClick={() => handleAppointmentAction(String(appointment.appointmentId), 'reject')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {appointment.appointmentStatus.toLowerCase() === 'upcoming' && (
                          <>
                            <button
                              className="cancel-btn"
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
                              className="complete-btn"
                              onClick={() => markAsCompleted(String(appointment.appointmentId))}
                            >
                              Complete it
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

      <div className="appointments-section completed-section">
        <h2>Completed Appointments</h2>
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