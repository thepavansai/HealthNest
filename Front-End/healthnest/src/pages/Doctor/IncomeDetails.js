import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './IncomeDetails.css';
import { BASE_URL } from '../../config/apiConfig';

const IncomeDetails = () => {
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [estimatedPayout, setEstimatedPayout] = useState(0);
  const [consultationFee, setConsultationFee] = useState(0);
  const [activeFilter, setActiveFilter] = useState('earned');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const doctorId = localStorage.getItem('doctorId'); // Already a string
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!doctorId) {
        console.error("Doctor ID not found.");
        // Handle missing ID, maybe redirect to login
        return;
    }
    const fetchDoctorProfile = async () => {
      try {
        // Use string doctorId in API call
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/doctor/profile/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const doctorProfile = response.data || {};
        setConsultationFee(doctorProfile.consultationFee || 0);
        // Fetch appointments only after getting the fee
        fetchAppointments(doctorProfile.consultationFee);
        return doctorProfile;
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
        setError('Failed to load doctor profile. Please try again later.');
        return null;
      }
    };

    const fetchAppointments = async (fee) => {
      try {
        const response = await axios.get(
          `${BASE_URL}/appointments/doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const allAppointments = response.data || [];


        const completed = allAppointments.filter(appointment => appointment.appointmentStatus === 'Completed'
          || appointment.appointmentStatus === 'Reviewed'
        );
        
        const upcoming = allAppointments.filter(appointment => 
          appointment.appointmentStatus === 'Upcoming' ||
          appointment.appointmentStatus === 'upcoming'
        );
        
        setCompletedAppointments(completed);
        setUpcomingAppointments(upcoming);


        const income = completed.length * fee; // Use the passed fee
        const payout = upcoming.length * fee; // Use the passed fee

        setTotalIncome(income);
        setEstimatedPayout(payout);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again later.');
        setLoading(false);
      }
    };


    fetchDoctorProfile(); // Start the chain
    // Removed fetchAppointments from here, it's called inside fetchDoctorProfile's success path
  }, [doctorId]); // Dependency array is correct

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
