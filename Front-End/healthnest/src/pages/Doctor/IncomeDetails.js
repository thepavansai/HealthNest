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

  const doctorId = localStorage.getItem('doctorId');

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/doctor/profile/${doctorId}`);
        const doctorProfile = response.data || {};
        setConsultationFee(doctorProfile.consultationFee || 0);
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/appointments/doctor/${doctorId}`);
        const allAppointments = response.data || [];

        
        const completed = allAppointments.filter(appointment => appointment.appointmentStatus === 'Completed'
          || appointment.appointmentStatus === 'Reviewed'
        );
        const upcoming = allAppointments.filter(appointment => appointment.appointmentStatus === 'Upcoming');

        setCompletedAppointments(completed);
        setUpcomingAppointments(upcoming);

        
        const income = completed.length * consultationFee;
        const payout = upcoming.length * consultationFee;

        setTotalIncome(income);
        setEstimatedPayout(payout);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };

    
    fetchDoctorProfile().then(fetchAppointments);
  }, [doctorId, consultationFee]);

  return (
    <div className="income-details-wrapper">
      <Header />

      <main className="income-details-container">
        <h1>Income Details</h1>

        {}
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

        {}
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

        {}
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