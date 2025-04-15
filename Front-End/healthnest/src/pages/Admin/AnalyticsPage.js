import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import { FaUserMd, FaEnvelope, FaPhoneAlt, FaUser } from 'react-icons/fa';
import './AnalyticsPage.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsPage = () => {
  const [appointmentsGraphData, setAppointmentsGraphData] = useState({});
  const [highestConsultedDoctor, setHighestConsultedDoctor] = useState(null);
  const [highestConsultedUser, setHighestConsultedUser] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [appointmentsResponse, doctorsResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:8080/admin/appointments'),
          axios.get('http://localhost:8080/admin/doctors'),
          axios.get('http://localhost:8080/admin/users'),
        ]);

        const appointments = appointmentsResponse.data;
        const doctors = doctorsResponse.data;
        const users = usersResponse.data;

        // Appointments Graph Data (Last 7 Days)
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        const appointmentsByDate = last7Days.map(date => ({
          date,
          count: appointments.filter(appointment => appointment.appointmentDate === date).length,
        }));

        setAppointmentsGraphData({
          labels: appointmentsByDate.map(data => data.date),
          datasets: [
            {
              label: 'Appointments',
              data: appointmentsByDate.map(data => data.count),
              backgroundColor: '#007bff',
            },
          ],
        });

        // Highest Consulted Doctor
        const doctorAppointmentsCount = appointments.reduce((acc, appointment) => {
          acc[appointment.doctorName] = (acc[appointment.doctorName] || 0) + 1;
          return acc;
        }, {});
        const mostConsultedDoctorName = Object.keys(doctorAppointmentsCount).reduce((a, b) =>
          doctorAppointmentsCount[a] > doctorAppointmentsCount[b] ? a : b
        );
        const mostConsultedDoctorDetails = doctors.find(
          doctor => doctor.doctorName === mostConsultedDoctorName
        );
        setHighestConsultedDoctor({
          name: mostConsultedDoctorDetails.doctorName,
          emailId: mostConsultedDoctorDetails.emailId,
          docPhnNo: mostConsultedDoctorDetails.docPhnNo,
          consultations: doctorAppointmentsCount[mostConsultedDoctorName],
        });

        // Highest Consulted User
        const userAppointmentsCount = appointments.reduce((acc, appointment) => {
          acc[appointment.userName] = (acc[appointment.userName] || 0) + 1;
          return acc;
        }, {});
        const mostConsultedUserName = Object.keys(userAppointmentsCount).reduce((a, b) =>
          userAppointmentsCount[a] > userAppointmentsCount[b] ? a : b
        );
        const mostConsultedUserDetails = users.find(
          user => user.name === mostConsultedUserName
        );
        setHighestConsultedUser({
          name: mostConsultedUserDetails.name,
          email: mostConsultedUserDetails.email,
          phoneNo: mostConsultedUserDetails.phoneNo,
          consultations: userAppointmentsCount[mostConsultedUserName],
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <>
      <Header />
      <motion.div
        className="analytics-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Analytics
        </motion.h1>

        <motion.div
          className="analytics-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Appointments (Last 7 Days)</h2>
          {appointmentsGraphData.labels ? (
            <Bar
              data={appointmentsGraphData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  x: {
                    ticks: {
                      autoSkip: false, // Ensure all x-axis labels are shown
                      maxRotation: 0, // Keep labels horizontal
                      padding: 10, // Add padding between labels
                    },
                    grid: {
                      display: false, // Remove grid lines for x-axis
                    },
                  },
                  y: {
                    beginAtZero: true,
                    max: 10, // Set the maximum value for the y-axis
                    ticks: {
                      stepSize:5, // Adjust step size for better scaling
                    },
                    grid: {
                      color: '#e0e0e0', // Light gray grid lines
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                  tooltip: {
                    enabled: true, // Enable tooltips for better interactivity
                  },
                },
              }}
            />
          ) : (
            <p>No data available</p>
          )}
        </motion.div>

        <motion.div
          className="analytics-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Most Consulted Doctor</h2>
          {highestConsultedDoctor ? (
            <div className="most-consulted-card">
              <FaUserMd className="icon" />
              <p>
                <strong>Dr. {highestConsultedDoctor.name}</strong>
              </p>
              <p>
                <FaEnvelope className="icon-small" /> {highestConsultedDoctor.emailId}
              </p>
              <p>
                <FaPhoneAlt className="icon-small" /> {highestConsultedDoctor.docPhnNo}
              </p>
              <p>
                <strong>Consultations:</strong> {highestConsultedDoctor.consultations}
              </p>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </motion.div>

        <motion.div
          className="analytics-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2>Most Frequent Visitor</h2>
          {highestConsultedUser ? (
            <div className="most-consulted-card">
              <FaUser className="icon" />
              <p>
                <strong>{highestConsultedUser.name}</strong>
              </p>
              <p>
                <FaEnvelope className="icon-small" /> {highestConsultedUser.email || 'N/A'}
              </p>
              <p>
                <FaPhoneAlt className="icon-small" /> {highestConsultedUser.phoneNo || 'N/A'}
              </p>
              <p>
                <strong>Consultations:</strong> {highestConsultedUser.consultations}
              </p>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </motion.div>
      </motion.div>
      <Footer />
    </>
  );
};

export default AnalyticsPage;