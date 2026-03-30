        package com.healthnest.controller;

import com.healthnest.dto.AppointmentShowDTO;
import com.healthnest.dto.AppointmentSummaryDTO;
import com.healthnest.exception.AppointmentNotFoundException;
import com.healthnest.model.Appointment;
import com.healthnest.model.Doctor;
import com.healthnest.service.AppointmentService;
import com.healthnest.service.DoctorService;
import com.healthnest.service.JWTService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AppointmentControllerTest {
    
    @InjectMocks
    private AppointmentController appointmentController;
    
    @Mock
    private AppointmentService appointmentService;
    
    @Mock
    private DoctorService doctorService;
    
    @Mock
    private JWTService jwtService;
    
    private final String AUTH_HEADER = "Bearer mock-jwt-token";
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Setup common mock behavior
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(jwtService.extractUserRole(anyString())).thenReturn("DOCTOR");
        
        Doctor doctor = new Doctor();
        doctor.setDoctorId(1L);
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(doctor);
    }

    @Test
    void getTodayAppointmentsByDoctor_shouldHandleIllegalArgumentException() {
        // Arrange
        Long doctorId = 1L;
        
        // More specific mock setup - explicitly match null parameter
        when(appointmentService.getTodayAppointmentsByDoctor(eq(doctorId), eq(null)))
            .thenThrow(new IllegalArgumentException("Date cannot be null"));
        
        // Act
        ResponseEntity<List<AppointmentShowDTO>> response = appointmentController.getTodayAppointmentsByDoctor(
                doctorId, null, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
    
    @Test
    void getTodayAppointmentsByDoctor_shouldReturnAppointments() {
        // Arrange
        Long doctorId = 1L;
        LocalDate today = LocalDate.now();
        List<AppointmentShowDTO> dtos = Arrays.asList(new AppointmentShowDTO(), new AppointmentShowDTO());
        
        Doctor doctor = new Doctor();
        doctor.setDoctorId(doctorId);
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(doctor);
        when(appointmentService.getTodayAppointmentsByDoctor(doctorId, today)).thenReturn(dtos);
        
        // Act
        ResponseEntity<List<AppointmentShowDTO>> response = appointmentController.getTodayAppointmentsByDoctor(
                doctorId, today, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(appointmentService).getTodayAppointmentsByDoctor(doctorId, today);
    }
    
    @Test
    void getTodayAppointmentsByDoctor_shouldReturnForbiddenWhenDoctorIdMismatch() {
        // Arrange
        Long doctorId = 1L;
        Long authenticatedDoctorId = 2L;
        LocalDate today = LocalDate.now();
        
        Doctor doctor = new Doctor();
        doctor.setDoctorId(authenticatedDoctorId);
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(doctor);
        
        // Act
        ResponseEntity<List<AppointmentShowDTO>> response = appointmentController.getTodayAppointmentsByDoctor(
                doctorId, today, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(appointmentService, never()).getTodayAppointmentsByDoctor(any(), any());
    }
    
    @Test
    void getDoctorAppointments_shouldReturnAppointments() {
        // Arrange
        Long doctorId = 2L;
        List<AppointmentShowDTO> dtos = Collections.singletonList(new AppointmentShowDTO());
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("user@example.com");
        when(appointmentService.getAppointmentsByDoctorId(doctorId)).thenReturn(dtos);
        
        // Act
        ResponseEntity<List<AppointmentShowDTO>> response = appointmentController.getDoctorAppointments(
                doctorId, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(appointmentService).getAppointmentsByDoctorId(doctorId);
    }
    
    @Test
    void acceptAppointment_shouldReturnUpdatedAppointment() {
        // Arrange
        Long appointmentId = 10L;
        Long doctorId = 5L;
        Appointment appointment = new Appointment();
        
        Doctor doctor = new Doctor();
        doctor.setDoctorId(doctorId);
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(doctor);
        when(appointmentService.acceptAppointment(appointmentId, doctorId)).thenReturn(appointment);
        
        // Act
        ResponseEntity<Appointment> response = appointmentController.acceptAppointment(
                appointmentId, doctorId, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(appointment, response.getBody());
        verify(appointmentService).acceptAppointment(appointmentId, doctorId);
    }
    
    @Test
    void acceptAppointment_shouldReturnForbiddenWhenDoctorIdMismatch() {
        // Arrange
        Long appointmentId = 10L;
        Long doctorId = 5L;
        Long authenticatedDoctorId = 6L;
        
        Doctor doctor = new Doctor();
        doctor.setDoctorId(authenticatedDoctorId);
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(doctor);
        
        // Act
        ResponseEntity<Appointment> response = appointmentController.acceptAppointment(
                appointmentId, doctorId, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(appointmentService, never()).acceptAppointment(any(), any());
    }
    
    @Test
    void rejectAppointment_shouldReturnUpdatedAppointment() {
        // Arrange
        Long appointmentId = 11L;
        Long doctorId = 6L;
        Appointment appointment = new Appointment();
        
        Doctor doctor = new Doctor();
        doctor.setDoctorId(doctorId);
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(doctor);
        when(appointmentService.rejectAppointment(appointmentId, doctorId)).thenReturn(appointment);
        
        // Act
        ResponseEntity<Appointment> response = appointmentController.rejectAppointment(
                appointmentId, doctorId, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(appointment, response.getBody());
        verify(appointmentService).rejectAppointment(appointmentId, doctorId);
    }
    
    @Test
    void rejectAppointment_shouldReturnForbiddenWhenDoctorIdMismatch() {
        // Arrange
        Long appointmentId = 11L;
        Long doctorId = 6L;
        Long authenticatedDoctorId = 7L;
        
        Doctor doctor = new Doctor();
        doctor.setDoctorId(authenticatedDoctorId);
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(doctor);
        
        // Act
        ResponseEntity<Appointment> response = appointmentController.rejectAppointment(
                appointmentId, doctorId, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(appointmentService, never()).rejectAppointment(any(), any());
    }
    
    @Test
    void getAllAppointmentsCount_shouldReturnCount() {
        // Arrange
        when(appointmentService.getAllAppointments()).thenReturn(
                Arrays.asList(new AppointmentShowDTO(), new AppointmentShowDTO()));
        
        // Act
        ResponseEntity<Integer> response = appointmentController.getAllAppointmentsCount();
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody());
        verify(appointmentService).getAllAppointments();
    }
    
    @Test
    void getUserAppointments_shouldReturnAppointments() {
        // Arrange
        Long userId = 3L;
        List<AppointmentSummaryDTO> dtos = Collections.singletonList(new AppointmentSummaryDTO());
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("user@example.com");
        when(appointmentService.isUserEmailMatching(userId, "user@example.com")).thenReturn(true);
        when(appointmentService.getAppointmentSummaries(userId)).thenReturn(dtos);
        
        // Act
        ResponseEntity<List<AppointmentSummaryDTO>> response = appointmentController.getUserAppointments(
                userId, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(appointmentService).getAppointmentSummaries(userId);
    }
    
    @Test
    void getUserAppointments_shouldReturnForbiddenWhenUserMismatch() {
        // Arrange
        Long userId = 3L;
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("user@example.com");
        when(appointmentService.isUserEmailMatching(userId, "user@example.com")).thenReturn(false);
        
        // Act
        ResponseEntity<List<AppointmentSummaryDTO>> response = appointmentController.getUserAppointments(
                userId, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(appointmentService, never()).getAppointmentSummaries(any());
    }
    
    @Test
    void changeStatus_shouldReturnSuccessForUser() {
        // Arrange
        Long appointmentId = 7L;
        String setStatus = "CANCELLED";
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("user@example.com");
        when(jwtService.extractUserRole(anyString())).thenReturn("USER");
        when(appointmentService.isAppointmentForUserEmail(appointmentId, "user@example.com")).thenReturn(true);
        when(appointmentService.updateAppointmentStatus(appointmentId, setStatus)).thenReturn(true);
        
        // Act
        ResponseEntity<String> response = appointmentController.changeStatus(
                appointmentId, setStatus, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Appointment status updated successfully", response.getBody());
        verify(appointmentService).updateAppointmentStatus(appointmentId, setStatus);
    }
    
    @Test
    void changeStatus_shouldReturnSuccessForDoctor() {
        // Arrange
        Long appointmentId = 7L;
        Long doctorId = 5L;
        String setStatus = "COMPLETED";
        
        Doctor doctor = new Doctor();
        doctor.setDoctorId(doctorId);
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(jwtService.extractUserRole(anyString())).thenReturn("DOCTOR");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(doctor);
        when(appointmentService.isAppointmentForDoctor(appointmentId, doctorId)).thenReturn(true);
        when(appointmentService.updateAppointmentStatus(appointmentId, setStatus)).thenReturn(true);
        
        // Act
        ResponseEntity<String> response = appointmentController.changeStatus(
                appointmentId, setStatus, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Appointment status updated successfully", response.getBody());
        verify(appointmentService).updateAppointmentStatus(appointmentId, setStatus);
    }
    
    @Test
    void changeStatus_shouldReturnForbiddenForInvalidUserAccess() {
        // Arrange
        Long appointmentId = 7L;
        String setStatus = "CANCELLED";
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("user@example.com");
        when(jwtService.extractUserRole(anyString())).thenReturn("USER");
        when(appointmentService.isAppointmentForUserEmail(appointmentId, "user@example.com")).thenReturn(false);
        
        // Act
        ResponseEntity<String> response = appointmentController.changeStatus(
                appointmentId, setStatus, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(appointmentService, never()).updateAppointmentStatus(any(), any());
    }
    
    @Test
    void changeStatus_shouldReturnForbiddenForInvalidDoctorAccess() {
        // Arrange
        Long appointmentId = 7L;
        Long doctorId = 5L;
        String setStatus = "COMPLETED";
        
        Doctor doctor = new Doctor();
        doctor.setDoctorId(doctorId);
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(jwtService.extractUserRole(anyString())).thenReturn("DOCTOR");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(doctor);
        when(appointmentService.isAppointmentForDoctor(appointmentId, doctorId)).thenReturn(false);
        
        // Act
        ResponseEntity<String> response = appointmentController.changeStatus(
                appointmentId, setStatus, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(appointmentService, never()).updateAppointmentStatus(any(), any());
    }
    
    @Test
    void changeStatus_shouldReturnBadRequestForInvalidDoctorStatus() {
        // Arrange
        Long appointmentId = 7L;
        Long doctorId = 5L;
        String setStatus = "INVALID_STATUS";
        
        Doctor doctor = new Doctor();
        doctor.setDoctorId(doctorId);
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(jwtService.extractUserRole(anyString())).thenReturn("DOCTOR");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(doctor);
        when(appointmentService.isAppointmentForDoctor(appointmentId, doctorId)).thenReturn(true);
        
        // Act
        ResponseEntity<String> response = appointmentController.changeStatus(
                appointmentId, setStatus, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(appointmentService, never()).updateAppointmentStatus(any(), any());
    }
    
    @Test
    void changeStatus_shouldReturnForbiddenForInvalidUserStatus() {
        // Arrange
        Long appointmentId = 7L;
        String setStatus = "COMPLETED"; // Users can only set CANCELLED or REVIEWED
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("user@example.com");
        when(jwtService.extractUserRole(anyString())).thenReturn("USER");
        when(appointmentService.isAppointmentForUserEmail(appointmentId, "user@example.com")).thenReturn(true);
        
        // Act
        ResponseEntity<String> response = appointmentController.changeStatus(
                appointmentId, setStatus, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(appointmentService, never()).updateAppointmentStatus(any(), any());
    }
    
    @Test
    void changeStatus_shouldReturnNotFoundWhenAppointmentNotFound() {
        // Arrange
        Long appointmentId = 7L;
        String setStatus = "CANCELLED";
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("user@example.com");
        when(jwtService.extractUserRole(anyString())).thenReturn("USER");
        when(appointmentService.isAppointmentForUserEmail(appointmentId, "user@example.com")).thenReturn(true);
        when(appointmentService.updateAppointmentStatus(appointmentId, setStatus)).thenReturn(false);
        
        // Act
        ResponseEntity<String> response = appointmentController.changeStatus(
                appointmentId, setStatus, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(appointmentService).updateAppointmentStatus(appointmentId, setStatus);
    }
    
    @Test
    void changeStatus_shouldReturnSuccessForAdmin() {
        // Arrange
        Long appointmentId = 7L;
        String setStatus = "CANCELLED";
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("admin@example.com");
        when(jwtService.extractUserRole(anyString())).thenReturn("ADMIN");
        when(appointmentService.updateAppointmentStatus(appointmentId, setStatus)).thenReturn(true);
        
        // Act
        ResponseEntity<String> response = appointmentController.changeStatus(
                appointmentId, setStatus, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Appointment status updated successfully", response.getBody());
        verify(appointmentService).updateAppointmentStatus(appointmentId, setStatus);
    }
    
    @Test
    void acceptAppointment_shouldHandleAppointmentNotFoundException() {
        // Arrange
        Long appointmentId = 10L;
        Long doctorId = 5L;
        
        Doctor doctor = new Doctor();
        doctor.setDoctorId(doctorId);
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(doctor);
        when(appointmentService.acceptAppointment(appointmentId, doctorId))
            .thenThrow(new AppointmentNotFoundException("Appointment not found"));
        
        // Act
        ResponseEntity<Appointment> response = appointmentController.acceptAppointment(
                appointmentId, doctorId, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
    
    @Test
    void rejectAppointment_shouldHandleAppointmentNotFoundException() {
        // Arrange
        Long appointmentId = 11L;
        Long doctorId = 6L;
        
        Doctor doctor = new Doctor();
        doctor.setDoctorId(doctorId);
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(doctor);
        when(appointmentService.rejectAppointment(appointmentId, doctorId))
            .thenThrow(new AppointmentNotFoundException("Appointment not found"));
        
        // Act
        ResponseEntity<Appointment> response = appointmentController.rejectAppointment(
                appointmentId, doctorId, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
    
 
    
    @Test
    void getDoctorAppointments_shouldHandleException() {
        // Arrange
        Long doctorId = 2L;
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("user@example.com");
        when(appointmentService.getAppointmentsByDoctorId(doctorId)).thenThrow(new RuntimeException("Database error"));
        
        // Act
        ResponseEntity<List<AppointmentShowDTO>> response = appointmentController.getDoctorAppointments(
                doctorId, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }
    
    @Test
    void getUserAppointments_shouldHandleException() {
        // Arrange
        Long userId = 3L;
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("user@example.com");
        when(appointmentService.isUserEmailMatching(userId, "user@example.com")).thenReturn(true);
        when(appointmentService.getAppointmentSummaries(userId)).thenThrow(new RuntimeException("Database error"));
        
        // Act
        ResponseEntity<List<AppointmentSummaryDTO>> response = appointmentController.getUserAppointments(
                userId, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }
    
    @Test
    void changeStatus_shouldHandleException() {
        // Arrange
        Long appointmentId = 7L;
        String setStatus = "CANCELLED";
        
        when(jwtService.extractUserEmail(anyString())).thenReturn("user@example.com");
        when(jwtService.extractUserRole(anyString())).thenReturn("USER");
        when(appointmentService.isAppointmentForUserEmail(appointmentId, "user@example.com")).thenReturn(true);
        when(appointmentService.updateAppointmentStatus(appointmentId, setStatus))
            .thenThrow(new RuntimeException("Database error"));
        
        // Act
        ResponseEntity<String> response = appointmentController.changeStatus(
                appointmentId, setStatus, AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().contains("Error updating appointment status"));
    }
    }

