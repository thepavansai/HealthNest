package com.healthnest.controller;

import com.healthnest.dto.DoctorDTO;
import com.healthnest.exception.AuthenticationException;
import com.healthnest.model.Doctor;
import com.healthnest.service.DoctorService;
import com.healthnest.service.JWTService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class AuthenticationControllerTest {

    @InjectMocks
    private AuthenticationController authenticationController;

    @Mock
    private DoctorService doctorService;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private JWTService jwtService;

    @Mock
    private AuthenticationConfiguration authConfig;

   private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Set admin credentials using ReflectionTestUtils
        ReflectionTestUtils.setField(authenticationController, "adminUsername", "admin");
        ReflectionTestUtils.setField(authenticationController, "adminPassword", "adminpass");
    }

  

    @Test
    void signUpDoctor_shouldReturnSuccess() {
        // Arrange
        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setEmailId("doctor@example.com");
        doctorDTO.setPassword("password123");
        
        Doctor doctor = new Doctor();
        doctor.setEmailId("doctor@example.com");
        doctor.setPassword("password123"); // Make sure password is set in the mapped object
        
        when(modelMapper.map(doctorDTO, Doctor.class)).thenReturn(doctor);
        when(doctorService.addDoctor(any(Doctor.class))).thenReturn("Doctor added successfully");
        
        // Act
        ResponseEntity<String> response = authenticationController.signUpDoctor(doctorDTO);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Doctor added successfully", response.getBody());
        
        // Capture the doctor object passed to addDoctor
        ArgumentCaptor<Doctor> doctorCaptor = ArgumentCaptor.forClass(Doctor.class);
        verify(doctorService).addDoctor(doctorCaptor.capture());
        
        Doctor capturedDoctor = doctorCaptor.getValue();
        assertEquals("doctor@example.com", capturedDoctor.getEmailId());
        assertNotNull(capturedDoctor.getPassword(), "Password should not be null");
        assertNotEquals("password123", capturedDoctor.getPassword(), 
                       "Password should be different from original: " + capturedDoctor.getPassword());
        
        // Verify that the password was hashed (check for BCrypt format more flexibly)
        assertTrue(capturedDoctor.getPassword().startsWith("$2"), 
                  "Password should be BCrypt hashed and start with $2: " + capturedDoctor.getPassword());
    }




    @Test
    void signUpDoctor_shouldHandleException() {
        // Arrange
        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setEmailId("doctor@example.com");
        doctorDTO.setPassword("password123");
        
        when(modelMapper.map(doctorDTO, Doctor.class)).thenThrow(new RuntimeException("Mapping error"));
        
        // Act
        ResponseEntity<String> response = authenticationController.signUpDoctor(doctorDTO);
        
        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("An error occurred during signup", response.getBody());
    }

    @Test
    void doctorLogin_shouldReturnSuccessWithToken() {
        // Arrange
        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setEmailId("doctor@example.com");
        doctorDTO.setPassword("password123");
        
        String hashedPassword = passwordEncoder.encode("password123");
        
        Doctor doctor = new Doctor();
        doctor.setDoctorId(1L);
        doctor.setDoctorName("Dr. Smith");
        doctor.setEmailId("doctor@example.com");
        
        when(doctorService.getDoctorPasswordHashByEmailId("doctor@example.com")).thenReturn(hashedPassword);
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(doctor);
        when(jwtService.generateToken("doctor@example.com", "DOCTOR")).thenReturn("jwt-token");
        
        // Act
        ResponseEntity<Map<String, String>> response = authenticationController.doctorLogin(doctorDTO);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        
        Map<String, String> responseBody = response.getBody();
        assertEquals("Login successful", responseBody.get("message"));
        assertEquals("1", responseBody.get("userId"));
        assertEquals("Dr. Smith", responseBody.get("name"));
        assertEquals("jwt-token", responseBody.get("token"));
        assertEquals("DOCTOR", responseBody.get("role"));
    }

    @Test
    void doctorLogin_shouldRejectInvalidPassword() {
        // Arrange
        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setEmailId("doctor@example.com");
        doctorDTO.setPassword("wrongpassword");
        
        String hashedPassword = passwordEncoder.encode("password123");
        
        when(doctorService.getDoctorPasswordHashByEmailId("doctor@example.com")).thenReturn(hashedPassword);
        
        // Act
        ResponseEntity<Map<String, String>> response = authenticationController.doctorLogin(doctorDTO);
        
        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid email or password", response.getBody().get("message"));
    }

    @Test
    void doctorLogin_shouldRejectEmptyCredentials() {
        // Arrange
        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setEmailId("");
        doctorDTO.setPassword("");
        
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authenticationController.doctorLogin(doctorDTO);
        });
        
        assertEquals("Email and password must not be empty", exception.getMessage());
    }

    @Test
    void doctorLogin_shouldHandleServiceException() {
        // Arrange
        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setEmailId("doctor@example.com");
        doctorDTO.setPassword("password123");
        
        when(doctorService.getDoctorPasswordHashByEmailId("doctor@example.com"))
            .thenThrow(new RuntimeException("Service error"));
        
        // Act
        ResponseEntity<Map<String, String>> response = authenticationController.doctorLogin(doctorDTO);
        
        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Service error", response.getBody().get("message"));
    }

    @Test
    void adminLogin_shouldReturnSuccessWithToken() {
        // Arrange
        Map<String, String> credentials = new HashMap<>();
        credentials.put("username", "admin");
        credentials.put("password", "adminpass");
        
        when(jwtService.generateToken("admin", "ADMIN")).thenReturn("admin-jwt-token");
        
        // Act
        ResponseEntity<Map<String, String>> response = authenticationController.adminLogin(credentials);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        
        Map<String, String> responseBody = response.getBody();
        assertEquals("Admin login successful", responseBody.get("message"));
        assertEquals("ADMIN", responseBody.get("role"));
        assertEquals("admin-jwt-token", responseBody.get("token"));
    }

    @Test
    void adminLogin_shouldRejectInvalidCredentials() {
        // Arrange
        Map<String, String> credentials = new HashMap<>();
        credentials.put("username", "admin");
        credentials.put("password", "wrongpassword");
        
        // Act & Assert
        Exception exception = assertThrows(AuthenticationException.class, () -> {
            authenticationController.adminLogin(credentials);
        });
        
        assertEquals("Invalid credentials", exception.getMessage());
    }

    @Test
    void adminLogin_shouldRejectEmptyCredentials() {
        // Arrange
        Map<String, String> credentials = new HashMap<>();
        credentials.put("username", null);
        credentials.put("password", null);
        
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authenticationController.adminLogin(credentials);
        });
        
        assertEquals("Username and password must not be empty", exception.getMessage());
    }

    @Test
    void hashPassword_shouldReturnHashedPassword() throws Exception {
        // This test uses reflection to test the private hashPassword method
        
        // Arrange
        String password = "password123";
        
        // Act
        String hashedPassword = (String) ReflectionTestUtils.invokeMethod(
            authenticationController, "hashPassword", password);
        
        // Assert
        assertNotNull(hashedPassword);
        assertNotEquals(password, hashedPassword);
        assertTrue(passwordEncoder.matches(password, hashedPassword));
    }
}
