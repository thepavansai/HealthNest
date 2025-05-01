import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './IncomeDetails.css';

const IncomeDetails = () => {
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [estimatedPayout, setEstimatedPayout] = useState(0);
  const [consultationFee, setConsultationFee] = useState(0);
  const [activeFilter, setActiveFilter] = useState('earned'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const doctorId = localStorage.getItem('doctorId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/doctor/profile/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const doctorProfile = response.data || {};
        setConsultationFee(doctorProfile.consultationFee || 0);
        return doctorProfile;
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
        setError('Failed to load doctor profile. Please try again later.');
        return null;
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/appointments/doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const allAppointments = response.data || [];
        
        const completed = allAppointments.filter(appointment => 
          appointment.appointmentStatus === 'Completed' || 
          appointment.appointmentStatus === 'Reviewed' ||
          appointment.appointmentStatus === 'completed' || 
          appointment.appointmentStatus === 'reviewed'
        );
        
        const upcoming = allAppointments.filter(appointment => 
          appointment.appointmentStatus === 'Upcoming' ||
          appointment.appointmentStatus === 'upcoming'
        );
        
        setCompletedAppointments(completed);
        setUpcomingAppointments(upcoming);
        
        const income = completed.length * consultationFee;
        const payout = upcoming.length * consultationFee;
        setTotalIncome(income);
        setEstimatedPayout(payout);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDoctorProfile().then(() => fetchAppointments());
  }, [doctorId, consultationFee, token]);

  if (loading) {
    return (
      <div className="income-details-wrapper">
        <Header />
        <main className="income-details-container">
          <div className="loading">Loading income details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="income-details-wrapper">
        <Header />
        <main className="income-details-container">
          <div className="error">{error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="income-details-wrapper">
      <Header />
      <main className="income-details-container">
        <h1>Income Details</h1>
        <div className="filter-buttons">
          <button
            className={`filter-button ${activeFilter === 'earned' ? 'active' : ''}`}
            onClick={() => setActiveFilter('earned')}
          >
            Earned Payments
          </button>
          <button
            className={`filter-button ${activeFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveFilter('pending')}
          >
            Pending Payments
          </button>
        </div>
        
        {activeFilter === 'earned' && (
          <section className="income-section">
            <h2>Total Earned Payments</h2>
            <p><strong>Total Income:</strong> ₹{totalIncome}</p>
            <div className="appointments-list">
              {completedAppointments.length > 0 ? (
                completedAppointments.map((appointment, index) => (
                  <div key={index} className="appointment-item completed">
                    <p><strong>Patient:</strong> {appointment.userName}</p>
                    <p><strong>Date:</strong> {appointment.appointmentDate}</p>
                    <p><strong>Description:</strong> {appointment.description}</p>
                  </div>
                ))
              ) : (
                <p>No earned payments available.</p>
              )}
            </div>
          </section>
        )}
        
        {activeFilter === 'pending' && (
          <section className="income-section">
            <h2>Pending Payments</h2>
            <p><strong>Estimated Payout:</strong> ₹{estimatedPayout}</p>
            <div className="appointments-list">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="appointment-item pending">
                    <p><strong>Patient:</strong> {appointment.userName}</p>
                    <p><strong>Date:</strong> {appointment.appointmentDate}</p>
                    <p><strong>Description:</strong> {appointment.description}</p>
                  </div>
                ))
              ) : (
                <p>No pending payments available.</p>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default IncomeDetails;
