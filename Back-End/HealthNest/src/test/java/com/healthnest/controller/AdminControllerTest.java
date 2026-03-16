package com.healthnest.controller;

import com.healthnest.dto.*;
import com.healthnest.exception.UserNotFoundException;
import com.healthnest.model.Doctor;
import com.healthnest.model.User;
import com.healthnest.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminControllerTest {

    @InjectMocks
    private AdminController adminController;
    
    @Mock
    private UserService userService;
    
    @Mock
    private DoctorService doctorService;
    
    @Mock
    private AppointmentService appointmentService;
    
    @Mock
    private FeedBackService feedBackService;
    
    @Mock
    private ModelMapper modelMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllUsers_shouldReturnMappedUserDTOs() {
        // Arrange
        User user1 = new User();
        user1.setUserId(1L);
        user1.setName("John Doe");
        
        List<User> users = List.of(user1);
        UserDTO dto1 = new UserDTO();
        dto1.setName("John Doe");
        
        when(userService.getAllUsers()).thenReturn(users);
        when(modelMapper.map(user1, UserDTO.class)).thenReturn(dto1);
        
        // Act - No more authHeader passed here
        ResponseEntity<List<UserDTO>> response = adminController.getAllUsers();
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(userService).getAllUsers();
    }

    @Test
    void deleteAllUsers_shouldReturnSuccessMessage() {
        // Arrange
        when(userService.deleteAllUsers()).thenReturn("All users deleted");
        
        // Act
        ResponseEntity<String> response = adminController.deleteAllUsers();
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("All users deleted", response.getBody());
    }

    @Test
    void getAllDoctors_shouldReturnMappedDoctorDTOs() {
        // Arrange
        Doctor doctor = new Doctor();
        doctor.setDoctorName("Dr. Smith");
        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setDoctorName("Dr. Smith");
        
        when(doctorService.getAllDoctors()).thenReturn(List.of(doctor));
        when(modelMapper.map(doctor, DoctorDTO.class)).thenReturn(doctorDTO);
        
        // Act
        ResponseEntity<List<DoctorDTO>> response = adminController.getAllDoctors();
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Dr. Smith", response.getBody().get(0).getDoctorName());
    }

    @Test
    void getAllAppointments_shouldReturnAppointmentDTOs() {
        // Arrange
        AppointmentShowDTO dto = new AppointmentShowDTO();
        when(appointmentService.getAllAppointments()).thenReturn(List.of(dto));
        
        // Act
        ResponseEntity<List<AppointmentShowDTO>> response = adminController.getAllAppointments();
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(appointmentService).getAllAppointments();
    }

    @Test
    void deleteAppointmentById_shouldReturnSuccessMessage() {
        // Arrange
        when(appointmentService.deleteAppointment(1L)).thenReturn("Deleted");
        
        // Act
        ResponseEntity<String> result = adminController.deleteAppointment(1L);
        
        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(appointmentService).deleteAppointment(1L);
    }

    @Test
    void acceptDoctor_shouldReturnSuccessMessage() {
        // Arrange
        doNothing().when(doctorService).updateDoctorStatus(1L, 1);
        
        // Act
        ResponseEntity<String> response = adminController.acceptDoctor(1L);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(doctorService).updateDoctorStatus(1L, 1);
    }

    @Test
    void rejectDoctor_shouldReturnSuccessMessage() {
        // Arrange
        doNothing().when(doctorService).updateDoctorStatus(1L, -1);
        
        // Act
        ResponseEntity<String> response = adminController.rejectDoctor(1L);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(doctorService).updateDoctorStatus(1L, -1);
    }

    @Test
    void deleteUser_shouldReturnNotFound_whenUserNotFound() {
        // Arrange
    	// Correct way to throw exception from a void method
    	doThrow(new UserNotFoundException("User not found"))
    	    .when(userService).deleteAccount(2L);
        
        // Act
        ResponseEntity<String> response = adminController.deleteUser(2L);
        
        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody());
    }

    @Test
    void handleException_shouldReturnInternalServerError() {
        // Arrange: Ensure you finish the stubbing with .thenThrow()
        when(userService.getAllUsers()).thenThrow(new RuntimeException("Unexpected database error"));
        
        // Act
        ResponseEntity<List<UserDTO>> response = adminController.getAllUsers();
        
        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(userService).getAllUsers();
    }
}