import styled from '@emotion/styled';
import {
  LocalHospital,
  MedicalServices,
  Star,
} from '@mui/icons-material';
import {
  Box,
  Card,
  Chip,
  CardContent,
  Rating,
  Typography,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const StyledCarousel = styled(Carousel)`
  .react-multi-carousel-item {
    padding: 8px;
  }
  .react-multi-carousel-dot button {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin: 0 4px;
  }
`;

const DoctorCard = styled(Card)`
  height: 100%;
  border-radius: 16px;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
  }
`;

const DoctorImage = styled('img')`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 16px 16px 0 0;
  border-bottom: 3px solid #4f46e5; 
`;

const DoctorCarousel = () => {
  const theme = useTheme();
  const [doctors, setDoctors] = useState([]);
  
  useEffect(() => {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('token');
    
    // Make the request with the Authorization header
    axios.get('http://localhost:8080/doctor/all')
      .then(res => {
        const availableDoctors = res.data.filter(doctor => doctor.status === 1);
        setDoctors(availableDoctors);
      })
      .catch(err => {
        console.error("Error fetching doctors", err);
      });
  }, []);

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

  if (doctors.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
        <Typography variant="h6">No doctors are available at the moment</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      p: 3,
      background: '#f2f0fa',
      borderRadius: 3,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
    }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          mb: 3,
          color: '#4f46e5', 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <MedicalServices sx={{ fontSize: 28, color: '#4f46e5' }} /> {}
        Available Doctors
      </Typography>
      <StyledCarousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={4000}
        showDots={true}
        customDot={<CustomDot />}
        containerClass="carousel-container"
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        {doctors.map(doctor => (
          <Box key={doctor.doctorId} sx={{ p: 1 }}>
            <DoctorCard>
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
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 1, color: '#4f46e5', fontWeight: 500 }}> {}
                  {doctor.doctorName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5, gap: 0.5 }}>
                  <LocalHospital sx={{ color: '#4f46e5', fontSize: 18 }} /> {}
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {doctor.hospitalName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <Rating
                    value={doctor.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                    icon={<Star sx={{ color: '#FFD700', fontSize: 18 }} />}
                    emptyIcon={<Star sx={{ color: '#E0E0E0', fontSize: 18 }}
                                     />}
                                  />{doctor.rating}
                              </Box>
                <Chip
                  label="Available"
                  size="small"
                  sx={{
                    mt: 1.5,
                    bgcolor: '#4CAF50',
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' },
                    fontSize: '0.8rem',
                  }}
                />
              </CardContent>
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
        background: active ? '#4f46e5' : '#E0E0E0', 
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        margin: '0 4px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
    />
  );
};

export default DoctorCarousel;
