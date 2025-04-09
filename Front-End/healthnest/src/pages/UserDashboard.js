import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  Container,
} from '@mui/material';
import {
  CalendarToday,
  LocalHospital,
  HealthAndSafety,
  Edit,
  Feedback,
  Logout,
  Person,
  EventNote,
  MedicalServices,
  ArrowForward,
} from '@mui/icons-material';
import axios from 'axios';
import './UserDashboard.css';
import DoctorCarousel from '../components/DoctorCarousel';

const UserDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8080/users/userdetails/${userId}`)
        .then((res) => {
          setUserData(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch user details", err);
        });
    }
  }, [userId]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHealthCheck = () => {
    navigate('/checkhealth');
  };

  const handleEditProfile = () => {
    navigate('/editprofile');
    handleMenuClose();
  };

  const handleFeedback = () => {
    navigate('/feedback');
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleBookAppointment = () => {
    navigate('/bookappointment');
  };

  const handleViewAppointments = () => {
    navigate('/viewappointments');
  };

  return (
    <Box className="dashboard-wrapper">
      <Header />
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Box className="hero-content">
            <Typography variant="h2" className="hero-text">
              Welcome back, {userData.name}
            </Typography>
            <Typography variant="h5" className="hero-subtext">
              Your health is our priority
            </Typography>
           
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" className="dashboard-container">
        <Grid container spacing={4} className="dashboard-content">
          <Grid item xs={12} md={4}>
            <Card className="profile-card">
              <CardContent>
                <Box className="profile-content">
                  <Avatar
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    className="large-avatar"
                  />
                  <Typography variant="h5" className="profile-name">
                    {userData.name}
                  </Typography>
                  <Badge badgeContent="Patient" color="primary" className="profile-badge" />
                  <Typography variant="body1" className="profile-email">
                    {userData.email}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="dashboard-card appointment-card" onClick={handleViewAppointments}>
              <CardContent>
                <Box className="card-content">
                  <EventNote className="large-icon" />
                  <Typography variant="h2" className="card-number">
                    2
                  </Typography>
                  <Typography variant="h6" className="card-title">
                    Upcoming Appointments
                  </Typography>
                  <Button 
                    endIcon={<ArrowForward />}
                    className="view-button"
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="dashboard-card consultation-card">
              <CardContent>
                <Box className="card-content">
                  <MedicalServices className="large-icon" />
                  <Typography variant="h2" className="card-number">
                    5
                  </Typography>
                  <Typography variant="h6" className="card-title">
                    Total Consultations
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card className="quick-actions-card">
              <CardContent>
                <Typography variant="h4" className="section-title">
                  Quick Actions
                </Typography>
                <Box className="action-buttons">
                  <Button
                    variant="contained"
                    startIcon={<HealthAndSafety />}
                    onClick={handleHealthCheck}
                    className="action-button health-check"
                  >
                    Health Check
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<LocalHospital />}
                    onClick={handleBookAppointment}
                    className="action-button book-appointment"
                  >
                    Book Appointment
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <DoctorCarousel></DoctorCarousel>
      <Footer />
    </Box>
  );
};

export default UserDashboard; 