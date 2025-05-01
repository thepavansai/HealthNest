import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCalendarCheck, FaCheckCircle, FaSearch, FaStar, FaRegStar } from 'react-icons/fa';
import './ViewAppointments.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { BASE_URL } from '../../config/apiConfig';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currAppointments, setCurrAppointments] = useState('All Appointments');
  const [ratings, setRatings] = useState({}); 
  const [ratedAppointments, setRatedAppointments] = useState(new Set());
  const [reviewedAppointments, setReviewedAppointments] = useState([]);
  

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/users/appointments/${localStorage.getItem('userId')}`);
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
  const pendingAppointments = appointments.filter(
    appointment => appointment.appointmentStatus.toLowerCase() === 'pending'
  );
  const reviewedAppointmentsList = appointments.filter(
    appointment => appointment.appointmentStatus.toLowerCase() === 'reviewed'
  );
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch =
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && appointment.appointmentStatus.toLowerCase() === filterStatus.toLowerCase();
  });


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
      const response = await axios.patch(`${BASE_URL}/users/cancelappointment/${appointmentId}`);
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
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'upcoming': return 'status-upcoming';
      case 'cancelled': return 'status-cancelled';
      case 'pending': return 'status-pending';
      case 'reviewed': return 'status-reviewed';
      default: return '';
    }
  };

  const updateRating = async (doctorId, appointmentId, rating) => {
    if (!rating) {
      alert('Please select a rating first');
      return;
    }

    if (ratedAppointments.has(appointmentId)) {
      alert('You have already submitted a rating for this appointment');
      return;
    }
    
    try {
      const ratingResponse = await axios.patch(`${BASE_URL}/doctor/${doctorId}/rating/${rating}`);
      if (ratingResponse.status === 200) {
        const reviewResponse = await axios.patch(`${BASE_URL}/appointments/${appointmentId}/status/Reviewed`);
        if (reviewResponse.status === 200) {
          alert('Rating submitted successfully!');
         
          setRatings(prev => ({
            ...prev,
            [appointmentId]: rating  
          }));
          setRatedAppointments(prev => new Set([...prev, appointmentId]));
          setAppointments(prevAppointments =>
            prevAppointments.map(appointment =>
              appointment.appointmentId === appointmentId
                ? { ...appointment, appointmentStatus: 'Reviewed' }
                : appointment
            )
          );
          setReviewedAppointments(prev => [...prev, appointmentId]);
        } else {
          alert('Failed to update appointment status. Please try again.');
        }
      } else {
        alert('Failed to update rating. Please try again.');
      }
    } catch (error) {
      console.error('Error updating rating:', error);
      alert('Error updating rating. Please try again later.');
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
  <Header/>
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
              <h3>{completedAppointments.length + reviewedAppointments.length}</h3>
              <p>Completed & Reviewed Appointments</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon pending-icon">
              <FaCalendarAlt />
            </div>
            <div className="summary-details">
              <h3>{pendingAppointments.length}</h3>
              <p>Pending Appointments</p>
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
          
          {/* <div className="summary-card">
            <div className="summary-icon reviewed-icon">
              <FaStar />
            </div>
            <div className="summary-details">
              <h3>{reviewedAppointmentsList.length}</h3>
              <p>Reviewed Appointments</p>
            </div> 
          </div>*/}
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
  style={{ textAlign: 'center' }}
/>

        </div>

        <div className="filter-buttons">
          <button
            className={filterStatus === 'all' ? 'active' : ''}
            onClick={() => {setFilterStatus('all');
              setCurrAppointments('All Appointments')}}
          >
            All
          </button>
          <button
            className={filterStatus === 'pending' ? 'active' : ''}
            onClick={() => {setFilterStatus('pending');
              setCurrAppointments('Pending Appointments')}
            }
          >
            Pending
          </button>
          <button
            className={filterStatus === 'upcoming' ? 'active' : ''}
            onClick={() =>{ setFilterStatus('upcoming');
              setCurrAppointments('Upcoming Appointments')}
            }
          >
            Upcoming
          </button>
          <button
            className={filterStatus === 'completed' ? 'active' : ''}
            onClick={() =>{ setFilterStatus('completed');
              setCurrAppointments('Completed Appointments')
            }
            }
          >
            Completed
          </button>
          <button
            className={filterStatus === 'cancelled' ? 'active' : ''}
            onClick={() => setFilterStatus('cancelled')}
          >
            Cancelled
          </button>
          <button
            className={filterStatus === 'reviewed' ? 'active' : ''}
            onClick={() => {setFilterStatus('reviewed');
              setCurrAppointments('Reviewed Appointments')}
            }
          >
            Reviewed
          </button>
        </div>
      </div>

      <div className="appointments-section">
        <h2>{currAppointments}</h2>
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
                    <td data-label="ID">{appointment.appointmentId}</td>
                    <td data-label="Doctor">Dr. {appointment.doctorName}</td>
                    <td data-label="Hospital">{appointment.hospitalName}</td>
                    <td data-label="Date & Time">
                      <div className="appointment-time">
                        <div>{new Date(appointment.appointmentDate).toLocaleDateString()}</div>
                        <span>{appointment.appointmentTime}</span>
                      </div>
                    </td>
                    <td data-label="Fee">₹{appointment.consultationFee}</td>
                    <td data-label="Status">
                      <span className={`status-badge ${getStatusClass(appointment.appointmentStatus)}`}>
                        {appointment.appointmentStatus}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div className="action-buttons">
                        {appointment.appointmentStatus.toLowerCase() === 'upcoming' && (
                          <button
                            className="cancel-btn"
                            onClick={() => cancelAppointment(appointment.appointmentId, appointment.appointmentDate, appointment.appointmentTime)}
                          >
                            Cancel
                          </button>
                        )}
                        {appointment.appointmentStatus.toLowerCase() === 'completed' && (
                          <div className="rating-action">
                            <div className="star-rating">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className="star-icon"
                                  onClick={() => {
                                    setRatings(prev => ({
                                      ...prev,
                                      [appointment.appointmentId]: star
                                    }));
                                  }}
                                >
                                  {star <= (ratings[appointment.appointmentId] || 0) ? (
                                    <FaStar className="star-filled" />
                                  ) : (
                                    <FaRegStar />
                                  )}
                                </span>
                              ))}
                            </div>
                            <button 
                              className="rate-btn"
                              disabled={ratedAppointments.has(appointment.appointmentId)}
                              onClick={() => updateRating(
                                appointment.doctorId,
                                appointment.appointmentId, 
                                ratings[appointment.appointmentId] || 0
                              )}
                            >
                              {ratedAppointments.has(appointment.appointmentId) ? 'Rating Submitted' : 'Submit Rating'}
                            </button>
                          </div>
                        )}
                         {appointment.appointmentStatus.toLowerCase() === 'pending' && (
                          <div></div>
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
        <h2>Completed Appointments Yet to  Give Rating</h2>
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
                  <h4>{appointment.doctorName}</h4>
                  <p>Hospital: {appointment.hospitalName}</p>
                  <p>Fee: ₹{appointment.consultationFee}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ViewAppointments;