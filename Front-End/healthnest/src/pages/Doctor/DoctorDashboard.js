import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2'; // Import Chart.js for analytics
import { CSVLink } from 'react-csv'; // Import CSV export functionality
import jsPDF from 'jspdf'; // Import jsPDF for PDF export

import React, { useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaKey,
  FaSignOutAlt,
  FaUserMd,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './DoctorDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [doctorData, setDoctorData] = useState({ doctorName: '', emailId: '', consultationFee: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIncome, setShowIncome] = useState(false);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [estimatedPayout, setEstimatedPayout] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [completedAppointmentsCount, setCompletedAppointmentsCount] = useState(0);
  const [upcomingAppointmentsCount, setUpcomingAppointmentsCount] = useState(0);
  const [appointmentTrends, setAppointmentTrends] = useState([]);

  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    if (doctorId) {
      // Fetch doctor profile to get consultation fee
      axios.get(`http://localhost:8080/doctor/profile/${doctorId}`)
        .then(res => {
          const doctorProfile = res.data || {};
          setDoctorData(doctorProfile);

          // Fetch appointments after getting consultation fee
          fetchAppointments(doctorProfile.consultationFee);
        })
        .catch(err => {
          console.error("Error fetching doctor profile:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [doctorId]);

  const fetchAppointments = async (consultationFee) => {
    try {
      const response = await axios.get(`http://localhost:8080/appointments/doctor/${doctorId}`);
      const allAppointments = response.data;
      console.log("All Appointments:", allAppointments);
      setTotalAppointments(allAppointments.length);
      setAppointments(allAppointments);

      // Filter appointments into Completed and Upcoming
      const completed = allAppointments.filter(appointment => appointment.appointmentStatus === 'Completed');
      const upcoming = allAppointments.filter(appointment => appointment.appointmentStatus === 'Upcoming');
      console.log("Completed Appointments:", completed);
      console.log("Upcoming Appointments:", upcoming);

      setCompletedAppointments(completed);
      setUpcomingAppointments(upcoming);

      // Calculate total income and estimated payout using consultation fee
      const income = completed.length * consultationFee;
      const payout = upcoming.length * consultationFee;

      setTotalIncome(income);
      setEstimatedPayout(payout);

    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const handleToggleIncome = () => {
    setShowIncome(prev => !prev);
  };

  // Prepare data for CSV export
  const csvHeaders = [
    { label: 'Patient Name', key: 'userName' },
    { label: 'Date', key: 'appointmentDate' },
    { label: 'Time', key: 'appointmentTime' },
    { label: 'Status', key: 'appointmentStatus' },
    { label: 'Fee', key: 'fee' },
  ];

  const csvData = appointments.map(appointment => ({
    userName: appointment.userName,
    appointmentDate: appointment.appointmentDate,
    appointmentTime: appointment.appointmentTime,
    appointmentStatus: appointment.appointmentStatus,
    fee: doctorData.consultationFee, // Use consultationFee from doctorData
  }));

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const lineHeight = 10;
    let y = 20;

    // Set font to Times New Roman
    doc.setFont('times', 'normal');

    // Title
    doc.setFontSize(14);
    doc.setFont('times', 'bold');
    doc.text('Appointments Report', pageWidth / 2, y, { align: 'center' });
    y += lineHeight * 2;

    // Table Headers
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text('S.No', margin, y);
    doc.text('Patient Name', margin + 20, y);
    doc.text('Date', margin + 70, y);
    doc.text('Time', margin + 110, y);
    doc.text('Status', margin + 140, y);
    doc.text('Fee', margin + 170, y);
    y += lineHeight;

    // Table Data
    doc.setFont('times', 'normal');
    appointments.forEach((appointment, index) => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin + lineHeight;
      }

      doc.text(`${index + 1}`, margin, y);
      doc.text(appointment.userName || 'N/A', margin + 20, y);
      doc.text(appointment.appointmentDate || 'N/A', margin + 70, y);
      doc.text(appointment.appointmentTime || 'N/A', margin + 110, y);
      doc.text(appointment.appointmentStatus || 'N/A', margin + 140, y);
      doc.text(`₹${doctorData.consultationFee}`, margin + 170, y);
      y += lineHeight;
    });

    // Save the PDF
    doc.save('appointments_report.pdf');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard-wrapper">
      <Header />

      <main className="doctor-dashboard-container">
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome back, {doctorData.doctorName || 'Doctor'} <span>👋</span></h1>
            <p className="subtitle">Here’s what’s happening with your practice today.</p>
          </div>

          <div className="profile-widget">
            <div className="profile-info" onClick={toggleDropdown}>
              <div className="profile-avatar"><FaUserMd size={24} /></div>
              <span className="profile-arrow">▼</span>
            </div>

            {showDropdown && (
              <div className="profile-dropdown-menu">
                <button onClick={() => navigate("/doctor/profile")}><FaUserMd /> Edit Profile</button>
                <button onClick={() => navigate("/doctor/change-password")}><FaKey /> Change Password</button>
                <button onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}><FaSignOutAlt /> Logout</button>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Today's Appointments Card */}
          <div className="dashboard-card patient-overview-card">
            <div className="card-header">
              <h3>Today's Appointments</h3>
            </div>
            <div className="card-content">
              {appointments.length > 0 ? (
                appointments.slice(0,2).map((appointment, index) => (
                  <div key={index} className="appointment-item">
                    <FaCalendarAlt className="card-icon pulse" />
                    <h6>{appointment.appointmentTime}</h6>
                    <p>{appointment.userName} - {appointment.description}</p>
                  </div>
                ))
              ) : (
                <p>No appointments for today.</p>
              )}
            </div>
          </div>

          {/* View All Appointments Card */}
          <div className="dashboard-card view-all-appointments-card">
            <div className="card-header">
              <h3>View All Appointments</h3>
            </div>
            <div className="card-content">
              <p>Check all your upcoming and past appointments.</p>
              <button
                className="view-all-button"
                onClick={() => navigate('/doctor/appointments')}
              >
                View All
              </button>
            </div>
          </div>

          {/* Total Income Card */}
          <div className="dashboard-card income-card">
            <div className="card-header">
              <h3>Total Earned Payments</h3>
              <button className="toggle-income-button" onClick={handleToggleIncome}>
                {showIncome ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="card-content">
              {showIncome ? (
                <>
                  <p><strong>Total Earned Payments:</strong> ₹{totalIncome}</p>
                  <p><strong>Estimated Upcoming Payments:</strong> ₹{estimatedPayout}</p>
                  <button
                    className="view-details-button"
                    onClick={() => navigate('/doctor/income-details')}
                  >
                    View Details
                  </button>
                </>
              ) : (
                <p>Your total income</p>
              )}
            </div>
          </div>

          {/* Export Data Card */}
          <div className="dashboard-card export-data-card">
            <div className="card-header">
              <h3>Export Data</h3>
            </div>
            <div className="card-content">
              <p>Export your appointments or earnings data for record-keeping.</p>
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename="appointments_data.csv"
                className="export-button"
              >
                Export as CSV
              </CSVLink>
              <button className="export-button" onClick={generatePDF}>
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DoctorDashboard;
