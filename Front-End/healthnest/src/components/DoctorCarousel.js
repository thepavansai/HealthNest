import styled from '@emotion/styled';
import {
  HealthAndSafety,
  MedicalServices,
  Star,
  ArrowForwardIos,
  ArrowBackIos,
  LocationOn,
  CheckCircle,  // Add this import for the Available status
} from '@mui/icons-material';
import {
  Box,
  Card,
  Chip,
  CardContent,
  Avatar,
  Typography,
  useTheme,
  Button,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { BASE_URL } from '../config/apiConfig';

const StyledCarousel = styled(Carousel)`
  position: relative;
  
  .react-multi-carousel-item {
    padding: 12px;
  }
  
  .react-multi-carousel-dot-list {
    margin-top: 25px;
    margin-bottom: 5px;
  }
  
  .react-multi-carousel-dot button {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 0 6px;
    border: none;
    transition: all 0.3s ease;
  }
  
  .react-multiple-carousel__arrow {
    background: rgba(79, 70, 229, 0.8);
    border-radius: 50%;
    min-width: 45px;
    min-height: 45px;
    
    &:hover {
      background: rgba(79, 70, 229, 1);
    }
    
    &::before {
      font-size: 18px;
      font-weight: bold;
    }
  }
`;

const NavigationContainer = styled(Box)`
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  pointer-events: none;
  
  button {
    pointer-events: auto;
  }
`;

const DoctorCard = styled(Card)`
  height: 100%;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: white;
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.08);
  border: 1px solid rgba(79, 70, 229, 0.1);
  overflow: hidden;
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(79, 70, 229, 0.15);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #4f46e5, #6366f1);
  }
`;

const DoctorImage = styled('img')`
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ImageContainer = styled(Box)`
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.9), transparent);
  }
`;

const InfoContainer = styled(CardContent)`
  position: relative;
  padding: 24px 20px;
`;

const CardOverlay = styled(Box)`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
`;

const RatingContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 6px 16px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(79, 70, 229, 0.15);
`;

const DoctorCarousel = () => {
  const theme = useTheme();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    setLoading(true);
    axios.get(`${BASE_URL}/doctor/summary`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        
        const availableDoctors = res.data.filter(doctor => doctor.status === 1);
        setDoctors(availableDoctors);
        setLoading(false);
      })
      .catch(err => {
      
        setError("Failed to load doctors");
        setLoading(false);
      });
  }, []);

  const extractCityName = (address) => {
    if (!address) return "Location Unknown";
    
 
    const parts = address.split(',').map(part => part.trim());
    
    
    if (parts.length >= 3) {
      return parts[parts.length - 3];
    }
    
    
    return parts[0] ;
  };

  let maleCounter = 0;
  let femaleCounter = 0;
  const getDoctorImage = (doctor) => {
    const gender = doctor.gender === "FEMALE" ? "female" : "male";
    const imageCount = 5; 
    
    let imageNumber;
    if (gender === "female") {
      imageNumber = (femaleCounter % imageCount) + 1;
      femaleCounter++;
    } else {
      imageNumber = (maleCounter % imageCount) + 1;
      maleCounter++;
    }
    return `/images/${gender}model${imageNumber}.jpg`;
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 600 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 600, min: 0 },
      items: 1,
    },
  };

  const ButtonGroup = ({ next, previous }) => {
    return (
      <NavigationContainer>
        <Button 
          onClick={previous} 
          variant="contained" 
          sx={{
            minWidth: '45px', 
            width: '45px', 
            height: '45px',
            borderRadius: '50%',
            p: 0,
            bgcolor: 'rgba(79, 70, 229, 0.8)',
            '&:hover': { bgcolor: 'rgba(79, 70, 229, 1)' }
          }}
        >
          <ArrowBackIos sx={{ fontSize: 18, ml: 1 }} />
        </Button>
        <Button 
          onClick={next} 
          variant="contained" 
          sx={{
            minWidth: '45px', 
            width: '45px', 
            height: '45px',
            borderRadius: '50%',
            p: 0,
            bgcolor: 'rgba(79, 70, 229, 0.8)',
            '&:hover': { bgcolor: 'rgba(79, 70, 229, 1)' }
          }}
        >
          <ArrowForwardIos sx={{ fontSize: 18 }} />
        </Button>
      </NavigationContainer>
    );
  };

  if (loading) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        mt: 4, 
        p: 5, 
        color: '#4f46e5',
        borderRadius: 3,
        background: 'rgba(79, 70, 229, 0.05)',
        border: '1px dashed rgba(79, 70, 229, 0.3)'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>Loading doctors...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        mt: 4, 
        p: 5, 
        color: '#f44336',
        borderRadius: 3,
        background: 'rgba(244, 67, 54, 0.05)',
        border: '1px dashed rgba(244, 67, 54, 0.3)'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>{error}</Typography>
      </Box>
    );
  }

  if (doctors.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        mt: 4, 
        p: 5, 
        color: '#4f46e5',
        borderRadius: 3,
        background: 'rgba(79, 70, 229, 0.05)',
        border: '1px dashed rgba(79, 70, 229, 0.3)'
      }}>
        <MedicalServices sx={{ fontSize: 48, color: 'rgba(79, 70, 229, 0.3)', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>No doctors are available at the moment</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      p: 4,
      position: 'relative',
      background: 'linear-gradient(150deg, #f8f7ff 0%, #f2f0fa 100%)',
      borderRadius: 4,
      boxShadow: '0 4px 20px rgba(79, 70, 229, 0.08)', 
      border: '1px solid rgba(79, 70, 229, 0.1)'
    }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          mb: 4,
          color: '#4f46e5',
          fontWeight: 700,
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <MedicalServices sx={{ fontSize: 28, color: '#4f46e5' }} />
        Available Doctors
      </Typography>
      <StyledCarousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={4000}
        showDots={true}
        customDot={<CustomDot />}
        arrows={false}
        customButtonGroup={<ButtonGroup />}
        containerClass="carousel-container"
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding"
      >
        {doctors.map(doctor => (
          <Box key={doctor.doctorId} sx={{ p: 1 }}>
            <DoctorCard>
              <ImageContainer>
                <DoctorImage
                  src={getDoctorImage(doctor)}
                  alt={doctor.doctorName}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = doctor.gender === "FEMALE"
                      ? "/images/femalemodel1.jpg"
                      : "/images/malemodel1.jpg";
                  }}
                />
              </ImageContainer>
              
              <InfoContainer>
                <CardOverlay>
                  <RatingContainer>
                    <Star sx={{ color: '#FFD700', fontSize: 18, mr: 0.5 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold',
                        color: '#555',
                        fontSize: '0.85rem',
                        mr: 0.5
                      }}>
                        Rating:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#555' }}>
                        {doctor.rating ? Number(doctor.rating).toFixed(1) : "4.5"}
                      </Typography>
                    </Box>
                  </RatingContainer>
                </CardOverlay>
                
                <Typography variant="h6" sx={{ 
                  mb: 1.5, 
                  color: '#4f46e5', 
                  fontWeight: 600,
                  textAlign: 'center',
                  mt: 1
                }}>
                  Dr. {doctor.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5, gap: 0.5 }}>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(79, 70, 229, 0.1)', 
                    width: 28, height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <HealthAndSafety sx={{ color: '#4f46e5', fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.primary" sx={{ 
                      fontSize: '0.9rem', 
                      fontWeight: 600, 
                      mr: 0.5 
                    }}>
                      Hospital:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                      {doctor.hospitalName || "HealthNest Hospital"}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mb: 2, 
                  gap: 0.5 
                }}>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(244, 67, 54, 0.1)', 
                    width: 28, height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <LocationOn sx={{ color: '#f44336', fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.primary" sx={{ 
                      fontSize: '0.9rem', 
                      fontWeight: 600, 
                      mr: 0.5 
                    }}>
                      Location:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                      { extractCityName(doctor.location) 
                  }
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Chip
                    icon={<MedicalServices sx={{ fontSize: '16px' }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mr: 0.5 }}>
                          Specialty:
                        </Typography>
                        <Typography sx={{ fontSize: '0.8rem' }}>
                          {doctor.specialization || "General Medicine"}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      bgcolor: 'rgba(79, 70, 229, 0.1)',
                      color: '#4f46e5',
                      border: '1px solid rgba(79, 70, 229, 0.3)',
                      borderRadius: '16px',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      py: 0.5,
                      '& .MuiChip-icon': {
                        color: '#4f46e5',
                        marginLeft: '6px',
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Chip
                    icon={<CheckCircle sx={{ fontSize: '16px' }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                          Status: Available
                        </Typography>
                      </Box>
                    }
                    size="small"
                    sx={{
                      bgcolor: 'rgba(76, 175, 80, 0.1)',
                      color: '#4CAF50',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      '&:hover': {
                        bgcolor: 'rgba(76, 175, 80, 0.2)',
                      },
                      '& .MuiChip-icon': {
                        color: '#4CAF50',
                        marginLeft: '6px',
                      }
                    }}
                  />
                </Box>
              </InfoContainer>
            </DoctorCard>
          </Box>
        ))}
      </StyledCarousel>
    </Box>
  );
};

const CustomDot = ({ onClick, ...rest }) => {
  const {
    active,
    carouselState: { currentSlide, deviceType }
  } = rest;
  return (
    <button
      className={active ? "active" : "inactive"}
      onClick={() => onClick()}
      style={{
        background: active ? '#4f46e5' : 'rgba(79, 70, 229, 0.2)', 
        width: active ? '12px' : '8px',
        height: active ? '12px' : '8px',
        borderRadius: '50%',
        margin: '0 6px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: active ? '0 2px 5px rgba(79, 70, 229, 0.3)' : 'none',
      }}
    />
  );
};

export default DoctorCarousel;
