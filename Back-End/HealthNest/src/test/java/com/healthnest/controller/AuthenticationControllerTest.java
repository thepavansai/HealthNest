package com.healthnest.controller;

import com.healthnest.dto.DoctorDTO;
import com.healthnest.exception.DoctorNotFoundException;
import com.healthnest.model.Doctor;
import com.healthnest.service.DoctorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthenticationControllerTest {

    private AuthenticationController authenticationController;
    private DoctorService doctorService;
    private ModelMapper modelMapper;

    @BeforeEach
    void setUp() throws Exception {
        doctorService = mock(DoctorService.class);
        modelMapper = mock(ModelMapper.class);
        authenticationController = new AuthenticationController();

        var doctorServiceField = AuthenticationController.class.getDeclaredField("doctorService");
        doctorServiceField.setAccessible(true);
        doctorServiceField.set(authenticationController, doctorService);

        var modelMapperField = AuthenticationController.class.getDeclaredField("modelMapper");
        modelMapperField.setAccessible(true);
        modelMapperField.set(authenticationController, modelMapper);
    }

    @Test
    void testSignUpDoctorSuccess() {
        DoctorDTO dto = new DoctorDTO();
        dto.setPassword("plainpassword");

        Doctor doctor = new Doctor();
        doctor.setPassword("hashedPassword");

        when(modelMapper.map(dto, Doctor.class)).thenReturn(doctor);
        when(doctorService.addDoctor(any(Doctor.class))).thenReturn("Doctor added");

        ResponseEntity<String> response = authenticationController.signUpDoctor(dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Doctor added", response.getBody());
    }

    @Test
    void testSignUpDoctorException() {
        DoctorDTO dto = new DoctorDTO();
        when(modelMapper.map(dto, Doctor.class)).thenThrow(new RuntimeException());

        ResponseEntity<String> response = authenticationController.signUpDoctor(dto);

        assertEquals(500, response.getStatusCodeValue());
        assertEquals("An error occurred during signup", response.getBody());
    }

    @Test
    void testDoctorLoginSuccess() {
        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setEmailId("test@example.com");
        doctorDTO.setPassword("password");

        String hashed = new BCryptPasswordEncoder().encode("password");

        Doctor mockDoctor = new Doctor();
        mockDoctor.setDoctorId(1l);
        mockDoctor.setDoctorName("Dr. Smith");

        when(doctorService.getDoctorPasswordHashByEmailId("test@example.com")).thenReturn(hashed);
        when(doctorService.getDoctorIdByEmail("test@example.com")).thenReturn(mockDoctor);

        ResponseEntity<Object> response = authenticationController.doctorLogin(doctorDTO);
        Map<?, ?> responseBody = (Map<?, ?>) response.getBody();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Login successful", responseBody.get("message"));
        assertEquals(1l, responseBody.get("userId"));
        assertEquals("Dr. Smith", responseBody.get("name"));
    }

    @Test
    void testDoctorLoginInvalidCredentials() {
        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setEmailId("wrong@example.com");
        doctorDTO.setPassword("wrongpass");

        when(doctorService.getDoctorPasswordHashByEmailId("wrong@example.com"))
            .thenThrow(new DoctorNotFoundException("Doctor not found with email: wrong@example.com"));

        assertThrows(DoctorNotFoundException.class, () -> {
            authenticationController.doctorLogin(doctorDTO);
        });
    }

    @Test
    void testDoctorLoginMissingFields() {
        DoctorDTO doctorDTO = new DoctorDTO();
        
        assertThrows(IllegalArgumentException.class, () -> {
            authenticationController.doctorLogin(doctorDTO);
        });
    }

}
