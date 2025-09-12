import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  FaChartBar,
  FaCalendarCheck,
  FaUserMd,
  FaUserPlus,
  FaPercentage,
  FaChartLine,
  FaChartPie,
  FaStethoscope,
} from 'react-icons/fa';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './AnalyticsPage.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Derived statistics
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [appointmentCompletionRate, setAppointmentCompletionRate] = useState(0);
  const [appointmentsGraphData, setAppointmentsGraphData] = useState({});
  const [appointmentStatusData, setAppointmentStatusData] = useState({});
 
  const [specialtyDistribution, setSpecialtyDistribution] = useState({});
  
  // New state for doctor ratings and appointment time analysis
  const [doctorRatingData, setDoctorRatingData] = useState({
    distribution: [],
    averageRating: 0,
    highestRatedSpecialty: { name: '', rating: 0 },
    lowestRatedSpecialty: { name: '', rating: 5 }
  });
  
  const [appointmentTimeData, setAppointmentTimeData] = useState({
    timeDistribution: [],
    peakHours: '',
    leastBusyHours: '',
    weekdayVsWeekend: ''
  });

  const processData = (appointmentsData, doctorsData, usersData) => {
    // Basic counts
    setTotalAppointments(appointmentsData.length);
    setTotalDoctors(doctorsData.length);
    setTotalUsers(usersData.length);
    // Appointment completion rate
    const completedAppointments = appointmentsData.filter(
      app => app.appointmentStatus === 'Completed' || app.appointmentStatus === 'Reviewed'
    ).length;
    const completionRate = appointmentsData.length > 0 
      ? (completedAppointments / appointmentsData.length) * 100 
      : 0;
    setAppointmentCompletionRate(completionRate);
    
    // Process all analytics
    processAppointmentsGraph(appointmentsData);
    processAppointmentStatus(appointmentsData);
    processSpecialtyDistribution(doctorsData);
    findMostConsultedEntities(appointmentsData, doctorsData, usersData);
    processDoctorRatings(doctorsData, appointmentsData);
    processHealthMetrics(appointmentsData, usersData);
    processAppointmentTimeAnalysis(appointmentsData);
  };

  useEffect(() => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        // Fetch all data in parallel
        const [appointmentsResponse, doctorsResponse, usersResponse] = await Promise.all([
          axios.get(`${BASE_URL}/admin/appointments`, config),
          axios.get(`${BASE_URL}/admin/doctors`, config),
          axios.get(`${BASE_URL}/admin/users`, config),
        ]);
        setAppointments(appointmentsResponse.data);
        setDoctors(doctorsResponse.data);
        setUsers(usersResponse.data);
        // Process the data
        processData(appointmentsResponse.data, doctorsResponse.data, usersResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, processData]);

  const processAppointmentsGraph = (appointmentsData) => {
    // Get last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }
    // Count appointments for each day
    const appointmentCounts = last7Days.map(day => {
      return appointmentsData.filter(app => {
        return app.appointmentDate === day;
      }).length;
    });
    // Format dates for display
    const formattedDates = last7Days.map(day => {
      const date = new Date(day);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    setAppointmentsGraphData({
      labels: formattedDates,
      datasets: [
        {
          label: 'Appointments',
          data: appointmentCounts,
          backgroundColor: 'rgba(66, 133, 244, 0.7)',
          borderColor: '#4285f4',
          borderWidth: 1,
          borderRadius: 5,
        },
      ],
    });
  };

  const processAppointmentStatus = (appointmentsData) => {
    // Count appointments by status
    const statusCounts = {
      Pending: 0,
      Upcoming: 0,
      Cancelled: 0,
      Completed: 0,
      Reviewed: 0,
    };
    appointmentsData.forEach(app => {
      if (statusCounts.hasOwnProperty(app.appointmentStatus)) {
        statusCounts[app.appointmentStatus]++;
      }
    });
    // Prepare data for chart
    setAppointmentStatusData({
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: [
            '#4285f4', // Pending - Blue
            '#fbbc05', // Upcoming - Yellow
            '#ea4335', // Cancelled - Red
            '#34a853', // Completed - Green
            '#9334a8', // Reviewed - Purple
          ],
          borderWidth: 1,
          borderColor: '#ffffff',
        },
      ],
    });
  };

  

  const processSpecialtyDistribution = (doctorsData) => {
    // Count doctors by specialty
    const specialtyCounts = {};
    doctorsData.forEach(doctor => {
      const specialty = doctor.specializedrole || 'Unknown';
      specialtyCounts[specialty] = (specialtyCounts[specialty] || 0) + 1;
    });
    // Convert to arrays for chart
    const specialties = Object.keys(specialtyCounts);
    const counts = Object.values(specialtyCounts);
    // Generate colors
    const backgroundColors = [
      '#4285f4', '#ea4335', '#fbbc05', '#34a853', '#9334a8', 
      '#4285f4aa', '#ea4335aa', '#fbbc05aa', '#34a853aa', '#9334a8aa'
    ];
    setSpecialtyDistribution({
      labels: specialties,
      datasets: [
        {
          data: counts,
          backgroundColor: backgroundColors.slice(0, specialties.length),
          borderWidth: 1,
          borderColor: '#ffffff',
        },
      ],
    });
  };

  

  const findMostConsultedEntities = (appointmentsData, doctorsData, usersData) => {
    // Count appointments by doctor
    const doctorAppointmentCounts = {};
    appointmentsData.forEach(app => {
      const doctorId = app.doctor?.doctorId;
      if (doctorId) {
        doctorAppointmentCounts[doctorId] = (doctorAppointmentCounts[doctorId] || 0) + 1;
      }
    });
    // Find doctor with most appointments
    let maxDoctorId = null;
    let maxDoctorCount = 0;
    Object.entries(doctorAppointmentCounts).forEach(([doctorId, count]) => {
      if (count > maxDoctorCount) {
        maxDoctorId = doctorId;
        maxDoctorCount = count;
      }
    });
    // Get doctor details
    if (maxDoctorId) {
      const doctor = doctorsData.find(doc => doc.doctorId === parseInt(maxDoctorId));
      if (doctor) {
        setHighestConsultedDoctor({
          ...doctor,
          consultations: maxDoctorCount,
        });
      }
    }
    // Count appointments by user
    const userAppointmentCounts = {};
    appointmentsData.forEach(app => {
      const userId = app.user?.userId;
      if (userId) {
        userAppointmentCounts[userId] = (userAppointmentCounts[userId] || 0) + 1;
      }
    });
    // Find user with most appointments
    let maxUserId = null;
    let maxUserCount = 0;
    Object.entries(userAppointmentCounts).forEach(([userId, count]) => {
      if (count > maxUserCount) {
        maxUserId = userId;
        maxUserCount = count;
      }
    });
    // Get user details
    if (maxUserId) {
      const user = usersData.find(u => u.userId === parseInt(maxUserId));
      if (user) {
         
        setHighestConsultedUser({
          ...user,
          consultations: maxUserCount,
        });
      }
    }
  };

  // Process doctor ratings data
  const processDoctorRatings = (doctorsData, appointmentsData) => {
  // Skip if no data
  if (!doctorsData.length) {
    return;
  }

    // Create rating distribution
    const ratingCounts = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    
    };

    // Count doctors by rating (rounded to nearest integer)
    doctorsData.forEach(doctor => {
    if (doctor.rating && doctor.rating > 0) {
      const roundedRating = Math.round(doctor.rating);
      if (roundedRating >= 1 && roundedRating <= 5) {
        ratingCounts[roundedRating]++;
      }
    }
  });

    // Calculate total doctors with ratings
    const totalRatedDoctors = Object.values(ratingCounts).reduce((sum, count) => sum + count, 0);
    
    // Calculate percentage for each rating
    const ratingDistribution = Object.entries(ratingCounts).map(([rating, count]) => ({
    rating: parseInt(rating),
    count,
    percentage: totalRatedDoctors > 0 ? Math.round((count / totalRatedDoctors) * 100) : 0
  })).sort((a, b) => b.rating - a.rating); // Sort by rating (highest first)

    // Calculate average rating
    const ratedDoctors = doctorsData.filter(doctor => doctor.rating && doctor.rating > 0);
  const totalRatingSum = ratedDoctors.reduce((sum, doctor) => sum + doctor.rating, 0);
  const averageRating = ratedDoctors.length > 0
    ? parseFloat((totalRatingSum / ratedDoctors.length).toFixed(1))
    : 0;

    // Group doctors by specialty and calculate average rating per specialty
     const specialtyRatings = {};
  doctorsData.forEach(doctor => {
    if (doctor.rating && doctor.rating > 0 && doctor.specializedrole) {
      if (!specialtyRatings[doctor.specializedrole]) {
        specialtyRatings[doctor.specializedrole] = {
          totalRating: 0,
          count: 0
        };
      }
      specialtyRatings[doctor.specializedrole].totalRating += doctor.rating;
      specialtyRatings[doctor.specializedrole].count++;
    }
  });

    // Calculate average rating per specialty
   const specialtyAverages = {};
  Object.entries(specialtyRatings).forEach(([specialty, data]) => {
    specialtyAverages[specialty] = parseFloat((data.totalRating / data.count).toFixed(1));
  });

    // Find highest and lowest rated specialties
    let highestRatedSpecialty = { name: 'N/A', rating: 0 };
    let lowestRatedSpecialty = { name: 'N/A', rating: 5 };

    Object.entries(specialtyAverages).forEach(([specialty, rating]) => {
      if (rating > highestRatedSpecialty.rating) {
        highestRatedSpecialty = { name: specialty, rating };
      }
      if (rating < lowestRatedSpecialty.rating) {
        lowestRatedSpecialty = { name: specialty, rating };
      }
    });

    // Set the doctor rating data
    setDoctorRatingData({
      distribution: ratingDistribution,
      averageRating,
      highestRatedSpecialty,
      lowestRatedSpecialty
    });
  };

  // Process appointment time analysis
  const processAppointmentTimeAnalysis = (appointmentsData) => {
    // Skip if no data
    if (!appointmentsData.length) {
      return;
    }

    // Define time slots
    const timeSlots = {
      'Morning (8AM-12PM)': { count: 0, range: [8, 12], color: 'morning' },
      'Afternoon (12PM-4PM)': { count: 0, range: [12, 16], color: 'afternoon' },
      'Evening (4PM-8PM)': { count: 0, range: [16, 20], color: 'evening' },
      'Night (8PM-8AM)': { count: 0, range: [20, 8], color: 'night' }
    };

    // Count appointments by time slot
    appointmentsData.forEach(appointment => {
      if (appointment.appointmentTime) {
        // Extract hour from appointment time (assuming format like "14:30:00")
        const hour = parseInt(appointment.appointmentTime.split(':')[0]);
        
        // Determine which time slot this hour belongs to
        Object.entries(timeSlots).forEach(([slotName, slotData]) => {
          const [start, end] = slotData.range;
          if (start < end) {
            // Normal time range (e.g., 8AM-12PM)
            if (hour >= start && hour < end) {
              timeSlots[slotName].count++;
            }
          } else {
            // Overnight time range (e.g., 8PM-8AM)
            if (hour >= start || hour < end) {
              timeSlots[slotName].count++;
            }
          }
        });
      }
    });

    // Calculate total appointments with time data
    const totalTimeSlotAppointments = Object.values(timeSlots).reduce(
      (sum, slot) => sum + slot.count, 0
    );

    // Calculate percentage for each time slot
    const timeDistribution = Object.entries(timeSlots).map(([slotName, slotData]) => ({
      name: slotName,
      count: slotData.count,
      percentage: totalTimeSlotAppointments > 0 
        ? Math.round((slotData.count / totalTimeSlotAppointments) * 100) 
        : 0,
      color: slotData.color
    }));

    // Analyze appointments by hour to find peak and least busy hours
    const hourCounts = {};
    for (let i = 0; i < 24; i++) {
      hourCounts[i] = 0;
    }

    appointmentsData.forEach(appointment => {
      if (appointment.appointmentTime) {
        const hour = parseInt(appointment.appointmentTime.split(':')[0]);
        hourCounts[hour]++;
      }
    });

    // Find peak hours (top 2 consecutive hours)
    let peakHourStart = 0;
    let peakHourCount = 0;

    for (let i = 0; i < 23; i++) {
      const consecutiveCount = hourCounts[i] + hourCounts[i + 1];
      if (consecutiveCount > peakHourCount) {
        peakHourStart = i;
        peakHourCount = consecutiveCount;
      }
    }

    // Format peak hours
    const peakHours = `${formatHour(peakHourStart)} - ${formatHour(peakHourStart + 2)}`;

    // Find least busy hours (lowest 2 consecutive hours during working hours 8AM-8PM)
    let leastBusyHourStart = 8;
    let leastBusyHourCount = Infinity;

    for (let i = 8; i < 19; i++) {
      const consecutiveCount = hourCounts[i] + hourCounts[i + 1];
      if (consecutiveCount < leastBusyHourCount && consecutiveCount > 0) {
        leastBusyHourStart = i;
        leastBusyHourCount = consecutiveCount;
      }
    }

    // Format least busy hours
    const leastBusyHours = `${formatHour(leastBusyHourStart)} - ${formatHour(leastBusyHourStart + 2)}`;

    // Analyze weekday vs weekend appointments
    const weekdayAppointments = appointmentsData.filter(appointment => {
      if (!appointment.appointmentDate) return false;
      const date = new Date(appointment.appointmentDate);
      const day = date.getDay();
      return day >= 1 && day <= 5; // Monday to Friday
    }).length;

    const weekendAppointments = appointmentsData.filter(appointment => {
      if (!appointment.appointmentDate) return false;
      const date = new Date(appointment.appointmentDate);
      const day = date.getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    }).length;

    // Calculate weekday vs weekend comparison
    let weekdayVsWeekend = '';
    if (weekdayAppointments > weekendAppointments) {
      const percentage = weekendAppointments > 0 
        ? Math.round((weekdayAppointments / weekendAppointments - 1) * 100) 
        : 100;
      weekdayVsWeekend = `${percentage}% more on weekdays`;
    } else if (weekendAppointments > weekdayAppointments) {
      const percentage = weekdayAppointments > 0 
        ? Math.round((weekendAppointments / weekdayAppointments - 1) * 100) 
        : 100;
      weekdayVsWeekend = `${percentage}% more on weekends`;
    } else {
      weekdayVsWeekend = 'Equal distribution';
    }

    // Set the appointment time data
    setAppointmentTimeData({
      timeDistribution,
      peakHours,
      leastBusyHours,
      weekdayVsWeekend
    });
  };

  // Helper function to format hour (e.g., 14 -> 2:00 PM)
  const formatHour = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${period}`;
  };

  const processHealthMetrics = (appointmentsData, usersData) => {
  // Skip if no data
  if (!appointmentsData.length || !usersData.length) {
    return;
  }
 const healthIssueKeywords = {
    'Fever': ['fever', 'high temperature', 'flu', 'cold'],
    'Headache': ['headache', 'migraine', 'head pain'],
    'Respiratory': ['cough', 'breathing', 'respiratory', 'asthma', 'pneumonia', 'bronchitis'],
    'Digestive': ['stomach', 'digestion', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'abdominal pain'],
    'Cardiovascular': ['heart', 'chest pain', 'blood pressure', 'hypertension', 'cardiovascular'],
    'Musculoskeletal': ['joint pain', 'muscle', 'back pain', 'arthritis', 'fracture', 'sprain'],
    'Skin': ['rash', 'skin', 'eczema', 'acne', 'dermatitis'],
    'Mental Health': ['anxiety', 'depression', 'stress', 'mental health', 'insomnia'],
    'Diabetes': ['diabetes', 'blood sugar', 'glucose'],
    'Allergies': ['allergy', 'allergic', 'allergies'],
    'Infection': ['infection', 'bacterial', 'viral', 'fungal'],
    'Chronic Pain': ['chronic pain', 'pain management'],
    'Checkup': ['checkup', 'routine', 'annual', 'preventive']
  };

  // Initialize counters
  const issueCount = {};
  Object.keys(healthIssueKeywords).forEach(issue => {
    issueCount[issue] = 0;
  });

  // Initialize monthly data
  const monthlyIssues = {};
  for (let i = 1; i <= 12; i++) {
    monthlyIssues[i] = { total: 0 };
    Object.keys(healthIssueKeywords).forEach(issue => {
      monthlyIssues[i][issue] = 0;
    });
  }

  // Initialize age group data
  const ageGroups = {
    'Under 18': { total: 0 },
    '18-30': { total: 0 },
    '31-45': { total: 0 },
    '46-60': { total: 0 },
    'Over 60': { total: 0 }
  };
  Object.keys(healthIssueKeywords).forEach(issue => {
    Object.keys(ageGroups).forEach(ageGroup => {
      ageGroups[ageGroup][issue] = 0;
    });
  });

  // Initialize gender data
  const genderIssues = {
    'Male': { total: 0 },
    'Female': { total: 0 },
    'Other': { total: 0 }
  };
  Object.keys(healthIssueKeywords).forEach(issue => {
    Object.keys(genderIssues).forEach(gender => {
      genderIssues[gender][issue] = 0;
    });
  });

  // Count of appointments with valid descriptions
  let validAppointments = 0;

  // Analyze each appointment
  appointmentsData.forEach(appointment => {
    if (appointment.description && appointment.appointmentDate) {
      validAppointments++;
      const description = appointment.description.toLowerCase();
      const month = new Date(appointment.appointmentDate).getMonth() + 1; // 1-12
      
      // Find the user for this appointment
      const user = usersData.find(u => u.userId === appointment.user?.userId);
      let ageGroup = 'Unknown';
      let gender = 'Other';
      
      // Determine age group if user data is available
      if (user && user.dateOfBirth) {
        const birthDate = new Date(user.dateOfBirth);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        
        if (age < 18) ageGroup = 'Under 18';
        else if (age <= 30) ageGroup = '18-30';
        else if (age <= 45) ageGroup = '31-45';
        else if (age <= 60) ageGroup = '46-60';
        else ageGroup = 'Over 60';
      }
      
      // Determine gender if available
      if (user && user.gender) {
        gender = user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : 'Other';
      }
      
      // Increment monthly counter
      monthlyIssues[month].total++;
      
      // Increment age group counter if known
      if (ageGroup !== 'Unknown') {
        ageGroups[ageGroup].total++;
      }
      
      // Increment gender counter
      genderIssues[gender].total++;
      
      // Check for each health issue
      Object.entries(healthIssueKeywords).forEach(([issue, keywords]) => {
        // Check if any keyword is in the description
        const hasIssue = keywords.some(keyword => description.includes(keyword));
        
        if (hasIssue) {
          // Increment issue counter
          issueCount[issue]++;
          
          // Increment monthly issue counter
          monthlyIssues[month][issue]++;
          
          // Increment age group issue counter if known
          if (ageGroup !== 'Unknown') {
            ageGroups[ageGroup][issue]++;
          }
          
          // Increment gender issue counter
          genderIssues[gender][issue]++;
        }
      });
    }
  });

  // Convert issue counts to sorted array
  const commonIssues = Object.entries(issueCount)
    .map(([issue, count]) => ({ issue, count }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 issues

  // Calculate percentages for each issue
  commonIssues.forEach(issue => {
    issue.percentage = Math.round((issue.count / validAppointments) * 100);
  });

  // Set the health metrics data
  setHealthMetricsData({
    commonIssues,
    issuesByMonth: monthlyIssues,
    issuesByAge: ageGroups,
    issuesByGender: genderIssues,
    totalAnalyzedAppointments: validAppointments
  });
};


  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics data...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="error-container">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <motion.div 
        className="analytics-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="analytics-header">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FaChartBar /> HealthNest Analytics Dashboard
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Comprehensive overview of platform performance, user engagement, and healthcare trends
          </motion.p>
        </div>
        {/* KPI Cards */}
        <motion.div 
          className="kpi-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="kpi-card">
            <div className="kpi-icon">
              <FaCalendarCheck />
            </div>
            <div className="kpi-content">
              <h3>Total Appointments</h3>
              <p className="kpi-value">{totalAppointments}</p>
              <p className="kpi-label">Lifetime appointments</p>
            </div>
          </div>
          
          <div className="kpi-card">
            <div className="kpi-icon">
              <FaUserMd />
            </div>
            <div className="kpi-content">
              <h3>Registered Doctors</h3>
              <p className="kpi-value">{totalDoctors}</p>
              <p className="kpi-label">Active healthcare providers</p>
            </div>
          </div>
          
          <div className="kpi-card">
            <div className="kpi-icon">
              <FaUserPlus />
            </div>
            <div className="kpi-content">
              <h3>Registered Users</h3>
              <p className="kpi-value">{totalUsers}</p>
              <p className="kpi-label">Platform users</p>
            </div>
          </div>
          
          <div className="kpi-card">
            <div className="kpi-icon">
              <FaPercentage />
            </div>
            <div className="kpi-content">
              <h3>Completion Rate</h3>
              <p className="kpi-value">{appointmentCompletionRate}%</p>
              <p className="kpi-label">Appointments completed</p>
            </div>
          </div>
        </motion.div>

        {/* Main Analytics Grid */}
        <div className="analytics-grid">
          {/* Appointments Trend Chart */}
          <motion.div
            className="analytics-card appointments-trend"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="card-header">
              <h2><FaChartLine /> Appointments (Last 7 Days)</h2>
            </div>
            <div className="card-body">
              {appointmentsGraphData.labels ? (
                <Bar
                  data={appointmentsGraphData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          font: {
                            size: 12
                          }
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                          size: 14
                        },
                        bodyFont: {
                          size: 13
                        },
                        padding: 10,
                        cornerRadius: 4
                      }
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false
                        },
                        ticks: {
                          font: {
                            size: 12
                          }
                        }
                      },
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                          font: {
                            size: 12
                          },
                          stepSize: 1
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="no-data">No appointment data available</div>
              )}
            </div>
          </motion.div>

          {/* Appointment Status Distribution */}
          <motion.div
            className="analytics-card status-distribution"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="card-header">
              <h2><FaChartPie /> Appointment Status</h2>
            </div>
            <div className="card-body">
              {appointmentStatusData.labels && appointmentStatusData.labels.length > 0 ? (
                <div className="chart-container">
                  <Doughnut
                    data={appointmentStatusData}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            font: {
                              size: 12
                            },
                            padding: 15
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleFont: {
                            size: 14
                          },
                          bodyFont: {
                            size: 13
                          },
                          padding: 10,
                          cornerRadius: 4
                        }
                      },
                      cutout: '65%'
                    }}
                  />
                </div>
              ) : (
                <div className="no-data">No status data available</div>
              )}
            </div>
          </motion.div>

         

          {/* Doctor Specialty Distribution */}
          <motion.div
            className="analytics-card specialty-distribution"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="card-header">
              <h2><FaStethoscope /> Doctor Specialties</h2>
            </div>
            <div className="card-body">
              {specialtyDistribution.labels && specialtyDistribution.labels.length > 0 ? (
                <Pie
                  data={specialtyDistribution}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          font: {
                            size: 12
                          },
                          padding: 15
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                          size: 14
                        },
                        bodyFont: {
                          size: 13
                        },
                        padding: 10,
                        cornerRadius: 4
                      }
                    }
                  }}
                />
              ) : (
                <div className="no-data">No specialty data available</div>
              )}
            </div>
          </motion.div>

          {/* User Growth */}
          

          {/* Doctor Rating Analysis - Now Dynamic */}
          <motion.div
            className="analytics-card rating-analysis"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="card-header">
              <h2><FaStethoscope /> Doctor Rating Analysis</h2>
            </div>
            <div className="card-body">
              {doctorRatingData.distribution.length > 0 ? (
                <div className="rating-distribution">
                  {/* Dynamic rating distribution bars */}
                  {doctorRatingData.distribution.map(item => (
                    <div className="rating-bar-container" key={`rating-${item.rating}`}>
                      <div className="rating-label">{item.rating} ★</div>
                      <div className="rating-bar-wrapper">
                        <div 
                          className="rating-bar" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <div className="rating-count">{item.count}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data-message">No rating data available</div>
              )}
              
              <div className="rating-summary">
                <div className="avg-rating">
                  <h3>Average Rating</h3>
                  <div className="rating-value">
                    {doctorRatingData.averageRating} <span className="star">★</span>
                  </div>
                </div>
         
              </div>
            </div>
          </motion.div>



          {/* Appointment Time Analysis - Now Dynamic */}
          <motion.div
            className="analytics-card time-analysis"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className="card-header">
              <h2><FaCalendarCheck /> Appointment Time Analysis</h2>
            </div>
            <div className="card-body">
              {appointmentTimeData.timeDistribution.length > 0 ? (
                <div className="time-distribution">
                  {/* Dynamic time slot distribution bars */}
                  {appointmentTimeData.timeDistribution.map(slot => (
                    <div className="time-slot-container" key={slot.name}>
                      <div className="time-slot-label">{slot.name}</div>
                      <div className="time-slot-bar-wrapper">
                        <div 
                          className={`time-slot-bar ${slot.color}`}
                          style={{ width: `${slot.percentage}%` }}
                        ></div>
                      </div>
                      <div className="time-slot-count">{slot.percentage}%</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data-message">No appointment time data available</div>
              )}
              
              <div className="time-insights">
                <div className="insight-item">
                  <h4>Peak Hours</h4>
                  <p>{appointmentTimeData.peakHours}</p>
                </div>
                <div className="insight-item">
                  <h4>Least Busy</h4>
                  <p>{appointmentTimeData.leastBusyHours}</p>
                </div>
               
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default AnalyticsPage;
