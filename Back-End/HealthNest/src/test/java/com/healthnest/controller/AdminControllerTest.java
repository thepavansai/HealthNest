package com.healthnest.controller;

import com.healthnest.dto.AppointmentShowDTO;
import com.healthnest.dto.DoctorDTO;
import com.healthnest.dto.FeedBackDTO;
import com.healthnest.dto.UserDTO;
import com.healthnest.exception.DoctorNotFoundException;
import com.healthnest.exception.UserNotFoundException;
import com.healthnest.model.Doctor;
import com.healthnest.model.User;
import com.healthnest.service.AppointmentService;
import com.healthnest.service.DoctorService;
import com.healthnest.service.FeedBackService;
import com.healthnest.service.JWTService;
import com.healthnest.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
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
    
    @Mock
    private JWTService jwtService;
    
    private static final String VALID_AUTH_HEADER = "Bearer valid_token";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // Setup default behavior for JWT service
        when(jwtService.extractUserRole("valid_token")).thenReturn("ADMIN");
    }

    @Test
    void getAllUsers_shouldReturnMappedUserDTOs_whenAdminRole() {
        // Arrange
        User user1 = new User();
        user1.setUserId(1L);
        user1.setName("John Doe");
        user1.setEmail("john@example.com");
        
        User user2 = new User();
        user2.setUserId(2L);
        user2.setName("Jane Smith");
        user2.setEmail("jane@example.com");
        
        List<User> users = Arrays.asList(user1, user2);
        
        UserDTO dto1 = new UserDTO();
        dto1.setUserId(1L);
        dto1.setName("John Doe");
        dto1.setEmail("john@example.com");
        
        UserDTO dto2 = new UserDTO();
        dto2.setUserId(2L);
        dto2.setName("Jane Smith");
        dto2.setEmail("jane@example.com");
        
        when(userService.getAllUsers()).thenReturn(users);
        when(modelMapper.map(user1, UserDTO.class)).thenReturn(dto1);
        when(modelMapper.map(user2, UserDTO.class)).thenReturn(dto2);
        
        // Act
        ResponseEntity<List<UserDTO>> response = adminController.getAllUsers(VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        assertEquals("John Doe", response.getBody().get(0).getName());
        assertEquals("Jane Smith", response.getBody().get(1).getName());
        verify(userService).getAllUsers();
        verify(jwtService).extractUserRole("valid_token");
        verify(modelMapper, times(2)).map(any(User.class), eq(UserDTO.class));
    }
    
    @Test
    void getAllUsers_shouldReturnForbidden_whenNotAdminRole() {
        // Arrange
        when(jwtService.extractUserRole("valid_token")).thenReturn("USER");
        
        // Act
        ResponseEntity<List<UserDTO>> response = adminController.getAllUsers(VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(jwtService).extractUserRole("valid_token");
        verify(userService, never()).getAllUsers();
    }

    @Test
    void deleteAllUsers_shouldReturnSuccessMessage_whenAdminRole() {
        // Arrange
        when(userService.deleteAllUsers()).thenReturn("All users deleted");
        
        // Act
        ResponseEntity<String> response = adminController.deleteAllUsers(VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("All users deleted", response.getBody());
        verify(userService).deleteAllUsers();
        verify(jwtService).extractUserRole("valid_token");
    }
    
    @Test
    void deleteAllUsers_shouldReturnForbidden_whenNotAdminRole() {
        // Arrange
        when(jwtService.extractUserRole("valid_token")).thenReturn("USER");
        
        // Act
        ResponseEntity<String> response = adminController.deleteAllUsers(VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Admin access required", response.getBody());
        verify(jwtService).extractUserRole("valid_token");
        verify(userService, never()).deleteAllUsers();
    }

    @Test
    void deleteAllDoctors_shouldReturnSuccessMessage_whenAdminRole() {
        // Arrange
        when(doctorService.deleteAllDoctors()).thenReturn("All doctors deleted");
        
        // Act
        ResponseEntity<String> response = adminController.deleteAllDoctors(VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("All doctors deleted", response.getBody());
        verify(doctorService).deleteAllDoctors();
        verify(jwtService).extractUserRole("valid_token");
    }
    
    @Test
    void deleteAllDoctors_shouldReturnForbidden_whenNotAdminRole() {
        // Arrange
        when(jwtService.extractUserRole("valid_token")).thenReturn("USER");
        
        // Act
        ResponseEntity<String> response = adminController.deleteAllDoctors(VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Admin access required", response.getBody());
        verify(jwtService).extractUserRole("valid_token");
        verify(doctorService, never()).deleteAllDoctors();
    }

    @Test
    void getAllDoctors_shouldReturnMappedDoctorDTOs_whenAdminRole() {
        // Arrange
        Doctor doctor = new Doctor();
        doctor.setDoctorId(1L);
        doctor.setDoctorName("Dr. Smith");
        
        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setDoctorId(1L);
        doctorDTO.setDoctorName("Dr. Smith");
        
        when(doctorService.getAllDoctors()).thenReturn(List.of(doctor));
        when(modelMapper.map(doctor, DoctorDTO.class)).thenReturn(doctorDTO);
        
        // Act
        ResponseEntity<List<DoctorDTO>> response = adminController.getAllDoctors(VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Dr. Smith", response.getBody().get(0).getDoctorName());
        verify(doctorService).getAllDoctors();
        verify(jwtService).extractUserRole("valid_token");
        verify(modelMapper).map(any(Doctor.class), eq(DoctorDTO.class));
    }
    
    @Test
    void getAllDoctors_shouldReturnForbidden_whenNotAdminRole() {
        // Arrange
        when(jwtService.extractUserRole("valid_token")).thenReturn("USER");
        
        // Act
        ResponseEntity<List<DoctorDTO>> response = adminController.getAllDoctors(VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(jwtService).extractUserRole("valid_token");
        verify(doctorService, never()).getAllDoctors();
    }

    @Test
    void getAllAppointments_shouldReturnAppointmentDTOs_whenAdminRole() {
        // Arrange
        AppointmentShowDTO dto = new AppointmentShowDTO();
        dto.setAppointmentId(1L);
        dto.setDoctorName("Dr. Who");
        
        when(appointmentService.getAllAppointments()).thenReturn(List.of(dto));
        
        // Act
        ResponseEntity<List<AppointmentShowDTO>> response = adminController.getAllAppointments(VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Dr. Who", response.getBody().get(0).getDoctorName());
        verify(appointmentService).getAllAppointments();
        verify(jwtService).extractUserRole("valid_token");
    }
    
    @Test
    void getAllAppointments_shouldReturnForbidden_whenNotAdminRole() {
        // Arrange
        when(jwtService.extractUserRole("valid_token")).thenReturn("USER");
        
        // Act
        ResponseEntity<List<AppointmentShowDTO>> response = adminController.getAllAppointments(VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(jwtService).extractUserRole("valid_token");
        verify(appointmentService, never()).getAllAppointments();
    }

    @Test
    void deleteAppointmentById_shouldReturnSuccessMessage_whenAdminRole() {
        // Arrange
        when(appointmentService.deleteAppointment(1L)).thenReturn("Appointment deleted");
        
        // Act
        ResponseEntity<String> result = adminController.deleteAppointment(1L, VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("Appointment deleted", result.getBody());
        verify(appointmentService).deleteAppointment(1L);
        verify(jwtService).extractUserRole("valid_token");
    }
    
    @Test
    void deleteAppointmentById_shouldReturnForbidden_whenNotAdminRole() {
        // Arrange
        when(jwtService.extractUserRole("valid_token")).thenReturn("USER");
        
        // Act
        ResponseEntity<String> result = adminController.deleteAppointment(1L, VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, result.getStatusCode());
        assertEquals("Admin access required", result.getBody());
        verify(jwtService).extractUserRole("valid_token");
        verify(appointmentService, never()).deleteAppointment(anyLong());
    }

    @Test
    void deleteAllAppointments_shouldReturnSuccessMessage_whenAdminRole() {
        // Arrange
        when(appointmentService.deleteAllAppointments()).thenReturn("All appointments deleted");
        
        // Act
        ResponseEntity<String> result = adminController.deleteAppointment(VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("All appointments deleted", result.getBody());
        verify(appointmentService).deleteAllAppointments();
        verify(jwtService).extractUserRole("valid_token");
    }
    
    @Test
    void deleteAllAppointments_shouldReturnForbidden_whenNotAdminRole() {
        // Arrange
        when(jwtService.extractUserRole("valid_token")).thenReturn("USER");
        
        // Act
        ResponseEntity<String> result = adminController.deleteAppointment(VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, result.getStatusCode());
        assertEquals("Admin access required", result.getBody());
        verify(jwtService).extractUserRole("valid_token");
        verify(appointmentService, never()).deleteAllAppointments();
    }

    @Test
    void getAllFeedbacks_shouldReturnFeedbackDTOs() {
        // Arrange
        FeedBackDTO dto = new FeedBackDTO();
        dto.setFeedback("Great service!");
        
        when(feedBackService.getAllFeedBack()).thenReturn(List.of(dto));
        
        // Act
        ResponseEntity<List<FeedBackDTO>> response = adminController.getAllFeedBacks();
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Great service!", response.getBody().get(0).getFeedback());
        verify(feedBackService).getAllFeedBack();
    }

    @Test
    void acceptDoctor_shouldReturnSuccessMessage_whenAdminRole() {
        // Arrange
        doNothing().when(doctorService).updateDoctorStatus(1L, 1);
        
        // Act
        ResponseEntity<String> response = adminController.acceptDoctor(1L, VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Doctor accepted successfully", response.getBody());
        verify(doctorService).updateDoctorStatus(1L, 1);
        verify(jwtService).extractUserRole("valid_token");
    }
    
    @Test
    void acceptDoctor_shouldReturnForbidden_whenNotAdminRole() {
        // Arrange
        when(jwtService.extractUserRole("valid_token")).thenReturn("USER");
        
        // Act
        ResponseEntity<String> response = adminController.acceptDoctor(1L, VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Admin access required", response.getBody());
        verify(jwtService).extractUserRole("valid_token");
        verify(doctorService, never()).updateDoctorStatus(anyLong(), anyInt());
    }
    
    @Test
    void acceptDoctor_shouldReturnNotFound_whenDoctorNotFound() {
        // Arrange
        doThrow(new DoctorNotFoundException("Doctor not found")).when(doctorService).updateDoctorStatus(2L, 1);
        
        // Act
        ResponseEntity<String> response = adminController.acceptDoctor(2L, VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Doctor not found", response.getBody());
        verify(doctorService).updateDoctorStatus(2L, 1);
        verify(jwtService).extractUserRole("valid_token");
    }

    @Test
    void rejectDoctor_shouldReturnSuccessMessage_whenAdminRole() {
        // Arrange
        doNothing().when(doctorService).updateDoctorStatus(1L, -1);
        // Act
        ResponseEntity<String> response = adminController.rejectDoctor(1L, VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Doctor rejected successfully", response.getBody());
        verify(doctorService).updateDoctorStatus(1L, -1);
        verify(jwtService).extractUserRole("valid_token");
    }
    
    @Test
    void rejectDoctor_shouldReturnForbidden_whenNotAdminRole() {
        // Arrange
        when(jwtService.extractUserRole("valid_token")).thenReturn("USER");
        
        // Act
        ResponseEntity<String> response = adminController.rejectDoctor(1L, VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Admin access required", response.getBody());
        verify(jwtService).extractUserRole("valid_token");
        verify(doctorService, never()).updateDoctorStatus(anyLong(), anyInt());
    }
    
    @Test
    void rejectDoctor_shouldReturnNotFound_whenDoctorNotFound() {
        // Arrange
        doThrow(new DoctorNotFoundException("Doctor not found")).when(doctorService).updateDoctorStatus(3L, -1);
        
        // Act
        ResponseEntity<String> response = adminController.rejectDoctor(3L, VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Doctor not found", response.getBody());
        verify(doctorService).updateDoctorStatus(3L, -1);
        verify(jwtService).extractUserRole("valid_token");
    }
    
    @Test
    void deleteDoctor_shouldReturnSuccessMessage_whenAdminRole() {
        // Arrange
        doNothing().when(doctorService).deleteDoctor(1L);
        
        // Act
        ResponseEntity<String> response = adminController.deleteDoctor(1L, VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Doctor deleted successfully", response.getBody());
        verify(doctorService).deleteDoctor(1L);
        verify(jwtService).extractUserRole("valid_token");
    }
    
    @Test
    void deleteDoctor_shouldReturnForbidden_whenNotAdminRole() {
        // Arrange
        when(jwtService.extractUserRole("valid_token")).thenReturn("USER");
        
        // Act
        ResponseEntity<String> response = adminController.deleteDoctor(1L, VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Admin access required", response.getBody());
        verify(jwtService).extractUserRole("valid_token");
        verify(doctorService, never()).deleteDoctor(anyLong());
    }
    
    @Test
    void deleteDoctor_shouldReturnNotFound_whenDoctorNotFound() {
        // Arrange
        doThrow(new DoctorNotFoundException("Doctor not found")).when(doctorService).deleteDoctor(2L);
        
        // Act
        ResponseEntity<String> response = adminController.deleteDoctor(2L, VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Doctor not found", response.getBody());
        verify(doctorService).deleteDoctor(2L);
        verify(jwtService).extractUserRole("valid_token");
    }
    
    @Test
    void deleteUser_shouldReturnSuccessMessage_whenAdminRole() {
        // Arrange
        doNothing().when(userService).deleteAccount(1L);
        
        // Act
        ResponseEntity<String> response = adminController.deleteUser(1L, VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User deleted successfully", response.getBody());
        verify(userService).deleteAccount(1L);
        verify(jwtService).extractUserRole("valid_token");
    }
    
    @Test
    void deleteUser_shouldReturnForbidden_whenNotAdminRole() {
        // Arrange
        when(jwtService.extractUserRole("valid_token")).thenReturn("USER");
        
        // Act
        ResponseEntity<String> response = adminController.deleteUser(1L, VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Admin access required", response.getBody());
        verify(jwtService).extractUserRole("valid_token");
        verify(userService, never()).deleteAccount(anyLong());
    }
    
    @Test
    void deleteUser_shouldReturnNotFound_whenUserNotFound() {
        // Arrange
        doThrow(new UserNotFoundException("User not found")).when(userService).deleteAccount(2L);
        
        // Act
        ResponseEntity<String> response = adminController.deleteUser(2L, VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody());
        verify(userService).deleteAccount(2L);
        verify(jwtService).extractUserRole("valid_token");
    }
    
    @Test
    void handleException_shouldReturnInternalServerError() {
        // Arrange
        doThrow(new RuntimeException("Unexpected error")).when(userService).getAllUsers();
        
        // Act
        ResponseEntity<List<UserDTO>> response = adminController.getAllUsers(VALID_AUTH_HEADER);
        
        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(userService).getAllUsers();
        verify(jwtService).extractUserRole("valid_token");
    }
    
    @Test
    void extractToken_shouldExtractTokenCorrectly() {
        // Arrange
        String authHeader = "Bearer valid_token";
        
        // Act & Assert - indirectly testing through other methods
        adminController.getAllUsers(authHeader);
        
        // Verify the token was extracted correctly
        verify(jwtService).extractUserRole("valid_token");
    }
}
