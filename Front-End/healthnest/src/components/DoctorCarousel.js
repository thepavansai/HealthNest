import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Rating,
  Chip,
  useTheme,
} from '@mui/material';
import {
  LocalHospital,
  MedicalServices,
  Star,
  LocationOn,
} from '@mui/icons-material';
import styled from '@emotion/styled';

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
  border-bottom: 3px solid #75AADB;
`;

const DoctorCarousel = () => {
  const theme = useTheme();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/admin/doctors')
      .then(res => {
        const availableDoctors = res.data;
        setDoctors(availableDoctors);
      })
      .catch(err => {
        console.error("Error fetching doctors", err);
      });
  }, []);

  const getDoctorImage = (doctor) => {
    const gender = doctor.gender === "FEMALE" ? "female" : "male";
    const randomNumber = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
    return `/images/${gender}model${randomNumber}.jpg`;
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
      background: 'aliceblue',
      borderRadius: 3,
      boxShadow: 'inset 0 1px 5px rgba(0, 0, 0, 0.05)',
    }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          mb: 3,
          color: '#1976d2',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <MedicalServices sx={{ fontSize: 28 }} />
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
                <Typography variant="h6" sx={{ mb: 1, color: '#1976d2', fontWeight: 500 }}>
                  Dr. {doctor.doctorName}
                </Typography>

                <Chip
                  icon={<MedicalServices sx={{ fontSize: 16 }} />}
                  label={doctor.specialization}
                  size="small"
                  sx={{
                    mb: 1.5,
                    bgcolor: '#1976d2',
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' },
                    fontSize: '0.8rem',
                  }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5, gap: 0.5 }}>
                  <LocalHospital sx={{ color: '#1976d2', fontSize: 18 }} />
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
                    emptyIcon={<Star sx={{ color: '#E0E0E0', fontSize: 18 }} />}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    ({doctor.rating})
                  </Typography>
                </Box>

                <Chip
                  icon={<LocationOn sx={{ fontSize: 16 }} />}
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
        background: active ? '#1976d2' : '#E0E0E0',
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