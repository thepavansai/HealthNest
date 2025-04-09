import React from 'react';
import { Box, Typography, Button, Card } from '@mui/material';
import styled from '@emotion/styled';

const DoctorCard = styled(Card)`
  display: block; /* Changed from flex to block */
  text-align: center; /* Center internal elements */
  padding: 20px;
  background: white;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
`;

const DoctorImage = styled('img')`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  margin: 0 auto 20px; /* Center image and add bottom margin */
`;

const DoctorInfo = styled(Box)`
  /* No specific styles needed now, parent handles centering */
`;

const BookButton = styled(Button)`
  margin-top: 10px;
  border-color: #1976d2;
  color: #1976d2;
  &:hover {
    background-color: #e3f2fd;
  }
`;

const DoctorProfileCard = ({ doctor = {} }) => {
  const { name = "Default Name", image = "malemodel10.jpg" } = doctor;

  return (
    <DoctorCard>
      <DoctorImage src={`/images/${image}`} alt={name} />
      <DoctorInfo>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Dr. {name}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
          Get dedicated care!
        </Typography>
        <BookButton variant="outlined">Book an Appointment</BookButton>
      </DoctorInfo>
    </DoctorCard>
  );
};

export default DoctorProfileCard;