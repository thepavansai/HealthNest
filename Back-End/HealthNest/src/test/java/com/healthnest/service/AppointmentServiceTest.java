package com.healthnest.service;

import com.healthnest.dto.AppointmentShowDTO;
import com.healthnest.dto.AppointmentSummaryDTO;
import com.healthnest.model.Appointment;
import com.healthnest.model.Doctor;
import com.healthnest.model.User;
import com.healthnest.repository.AppointmentRepository;
import com.healthnest.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AppointmentServiceTest {

    @InjectMocks
    private AppointmentService appointmentService;

    @Mock
    private AppointmentRepository appointmentRepository;
    
    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private Appointment createValidAppointment(Long appointmentId, Long doctorId) {
        Appointment appointment = new Appointment();
        appointment.setAppointmentId(appointmentId);
        appointment.setAppointmentDate(LocalDate.now().plusDays(1));
        appointment.setAppointmentTime(LocalTime.of(10, 0));
        appointment.setAppointmentStatus("Pending");
        appointment.setDescription("Test appointment");
        
        Doctor doctor = new Doctor();
        doctor.setDoctorId(doctorId);
        appointment.setDoctor(doctor);
        
        User user = new User();
        user.setUserId(1L);
        appointment.setUser(user);
        
        return appointment;
    }

    @Test
    void getAppointmentSummaries_shouldReturnList() {
        List<AppointmentSummaryDTO> dtos = Arrays.asList(new AppointmentSummaryDTO(), new AppointmentSummaryDTO());
        when(appointmentRepository.findAppointmentSummariesByUserId(1L)).thenReturn(dtos);
        
        List<AppointmentSummaryDTO> result = appointmentService.getAppointmentSummaries(1L);
        
        assertEquals(2, result.size());
        verify(appointmentRepository).findAppointmentSummariesByUserId(1L);
    }

    @Test
    void acceptAppointment_shouldUpdateStatus() {
        Appointment appointment = createValidAppointment(1L, 2L);
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any())).thenReturn(appointment);
        
        Appointment result = appointmentService.acceptAppointment(1L, 2L);
        
        assertEquals("Upcoming", result.getAppointmentStatus());
        verify(appointmentRepository).save(appointment);
    }

    @Test
    void acceptAppointment_shouldThrowIfNullIds() {
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            appointmentService.acceptAppointment(null, 1L)
        );
        assertTrue(ex.getMessage().contains("cannot be null"));
    }

    @Test
    void acceptAppointment_shouldThrowIfNotFound() {
        when(appointmentRepository.findById(1L)).thenReturn(Optional.empty());
        
        Exception ex = assertThrows(RuntimeException.class, () ->
            appointmentService.acceptAppointment(1L, 2L)
        );
        
        assertTrue(ex.getMessage().contains("not found"));
    }

    @Test
    void acceptAppointment_shouldThrowIfUnauthorized() {
        Appointment appointment = createValidAppointment(1L, 3L);
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        
        Exception ex = assertThrows(RuntimeException.class, () ->
            appointmentService.acceptAppointment(1L, 2L)
        );
        
        assertTrue(ex.getMessage().contains("not authorized"));
    }

    @Test
    void acceptAppointment_shouldThrowIfInvalidAppointment() {
        Appointment appointment = createValidAppointment(1L, 2L);
        appointment.setAppointmentDate(null);
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            appointmentService.acceptAppointment(1L, 2L)
        );
        
        assertTrue(ex.getMessage().contains("date cannot be null"));
    }

    @Test
    void acceptAppointment_shouldThrowIfAppointmentDateInPast() {
        Appointment appointment = createValidAppointment(1L, 2L);
        appointment.setAppointmentDate(LocalDate.now().minusDays(1));
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            appointmentService.acceptAppointment(1L, 2L)
        );
        
        assertTrue(ex.getMessage().contains("in the past"));
    }

    @Test
    void acceptAppointment_shouldThrowIfAppointmentTimeNull() {
        Appointment appointment = createValidAppointment(1L, 2L);
        appointment.setAppointmentTime(null);
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            appointmentService.acceptAppointment(1L, 2L)
        );
        
        assertTrue(ex.getMessage().contains("time cannot be null"));
    }

    @Test
    void acceptAppointment_shouldThrowIfDescriptionEmpty() {
        Appointment appointment = createValidAppointment(1L, 2L);
        appointment.setDescription("   ");
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            appointmentService.acceptAppointment(1L, 2L)
        );
        
        assertTrue(ex.getMessage().contains("description cannot be empty"));
    }

    @Test
    void acceptAppointment_shouldThrowIfUserNull() {
        Appointment appointment = createValidAppointment(1L, 2L);
        appointment.setUser(null);
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            appointmentService.acceptAppointment(1L, 2L)
        );
        
        assertTrue(ex.getMessage().contains("User cannot be null"));
    }

    @Test
    void acceptAppointment_shouldThrowIfDoctorNull() {
        Appointment appointment = createValidAppointment(1L, 2L);
        appointment.setDoctor(null);
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            appointmentService.acceptAppointment(1L, 2L)
        );
        
        assertTrue(ex.getMessage().contains("Doctor cannot be null"));
    }

    @Test
    void rejectAppointment_shouldUpdateStatus() {
        Appointment appointment = createValidAppointment(1L, 2L);
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any())).thenReturn(appointment);
        
        Appointment result = appointmentService.rejectAppointment(1L, 2L);
        
        assertEquals("Cancelled", result.getAppointmentStatus());
        verify(appointmentRepository).save(appointment);
    }

    @Test
    void rejectAppointment_shouldThrowIfNotFound() {
        when(appointmentRepository.findById(1L)).thenReturn(Optional.empty());
        
        Exception ex = assertThrows(RuntimeException.class, () ->
            appointmentService.rejectAppointment(1L, 2L)
        );
        
        assertTrue(ex.getMessage().contains("not found"));
    }

    @Test
    void rejectAppointment_shouldThrowIfUnauthorized() {
        Appointment appointment = createValidAppointment(1L, 3L);
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        
        Exception ex = assertThrows(RuntimeException.class, () ->
            appointmentService.rejectAppointment(1L, 2L)
        );
        
        assertTrue(ex.getMessage().contains("not authorized"));
    }

    @Test
    void getAppointments_shouldReturnList() {
        List<AppointmentShowDTO> dtos = Arrays.asList(new AppointmentShowDTO(), new AppointmentShowDTO());
        when(appointmentRepository.findByDoctorIdWithUserName(2L)).thenReturn(dtos);
        
        List<AppointmentShowDTO> result = appointmentService.getAppointments(2L);
        
        assertEquals(2, result.size());
        verify(appointmentRepository).findByDoctorIdWithUserName(2L);
    }

    @Test
    void getAllAppointments_shouldReturnList() {
        List<AppointmentShowDTO> dtos = Arrays.asList(new AppointmentShowDTO(), new AppointmentShowDTO());
        when(appointmentRepository.findAllAppointments()).thenReturn(dtos);
        
        List<AppointmentShowDTO> result = appointmentService.getAllAppointments();
        
        assertEquals(2, result.size());
        verify(appointmentRepository).findAllAppointments();
    }

    @Test
    void deleteAllAppointments_shouldReturnSuccess() {
        doNothing().when(appointmentRepository).deleteAll();
        
        String result = appointmentService.deleteAllAppointments();
        
        assertTrue(result.contains("successfully"));
        verify(appointmentRepository).deleteAll();
    }

    @Test
    void deleteAllAppointments_shouldThrowOnException() {
        doThrow(new RuntimeException("fail")).when(appointmentRepository).deleteAll();
        
        Exception ex = assertThrows(RuntimeException.class, () ->
            appointmentService.deleteAllAppointments()
        );
        
        assertTrue(ex.getMessage().contains("Failed to delete"));
    }

    @Test
    void deleteAppointment_shouldDeleteIfExists() {
        when(appointmentRepository.existsById(1L)).thenReturn(true);
        doNothing().when(appointmentRepository).deleteById(1L);
        
        String result = appointmentService.deleteAppointment(1L);
        
        assertTrue(result.contains("successfully"));
        verify(appointmentRepository).deleteById(1L);
    }

    @Test
    void deleteAppointment_shouldReturnNotExistIfMissing() {
        when(appointmentRepository.existsById(1L)).thenReturn(false);
        
        String result = appointmentService.deleteAppointment(1L);
        
        assertTrue(result.contains("does not exist"));
        verify(appointmentRepository, never()).deleteById(1L);
    }

    @Test
    void getTodayAppointmentsByDoctor_shouldFilterByDate() {
        AppointmentShowDTO dto1 = mock(AppointmentShowDTO.class);
        AppointmentShowDTO dto2 = mock(AppointmentShowDTO.class);
        LocalDate today = LocalDate.now();
        
        when(dto1.getAppointmentDate()).thenReturn(today);
        when(dto2.getAppointmentDate()).thenReturn(today.plusDays(1));
        when(appointmentRepository.findByDoctorIdWithUserName(2L)).thenReturn(Arrays.asList(dto1, dto2));
        
        List<AppointmentShowDTO> result = appointmentService.getTodayAppointmentsByDoctor(2L, today);
        
        assertEquals(1, result.size());
        assertEquals(dto1, result.get(0));
    }

    @Test
    void changeStatus_shouldUpdateStatus() {
        Appointment appointment = createValidAppointment(1L, 2L);
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        
        String result = appointmentService.changeStatus(1L, "Completed");
        
        assertEquals("Sucessfully Completed", result);
        assertEquals("Completed", appointment.getAppointmentStatus());
    }

    @Test
    void changeStatus_shouldThrowIfAppointmentNotFound() {
        when(appointmentRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(NoSuchElementException.class, () ->
            appointmentService.changeStatus(1L, "Completed")
        );
    }
    
    @Test
    void isAppointmentForDoctor_shouldReturnTrueWhenMatches() {
        Appointment appointment = createValidAppointment(1L, 2L);
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        
        boolean result = appointmentService.isAppointmentForDoctor(1L, 2L);
        
        assertTrue(result);
    }
    
    @Test
    void isAppointmentForDoctor_shouldReturnFalseWhenDoctorIdDiffers() {
        Appointment appointment = createValidAppointment(1L, 3L);
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        
        boolean result = appointmentService.isAppointmentForDoctor(1L, 2L);
        
        assertFalse(result);
    }
    
    @Test
    void isAppointmentForDoctor_shouldReturnFalseWhenAppointmentNotFound() {
        when(appointmentRepository.findById(1L)).thenReturn(Optional.empty());
        
        boolean result = appointmentService.isAppointmentForDoctor(1L, 2L);
        
        assertFalse(result);
    }
    
    @Test
    void isAppointmentForUserEmail_shouldReturnTrueWhenMatches() {
        Appointment appointment = createValidAppointment(1L, 2L);
        User user = new User();
        user.setUserId(1L);
        user.setEmail("test@example.com");
        
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        
        boolean result = appointmentService.isAppointmentForUserEmail(1L, "test@example.com");
        
        assertTrue(result);
    }
    
    @Test
    void isAppointmentForUserEmail_shouldReturnFalseWhenUserIdDiffers() {
        Appointment appointment = createValidAppointment(1L, 2L);
        User user = new User();
        user.setUserId(2L); // Different from appointment's user ID
        user.setEmail("test@example.com");
        
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        
        boolean result = appointmentService.isAppointmentForUserEmail(1L, "test@example.com");
        
        assertFalse(result);
    }
    
    @Test
    void isAppointmentForUserEmail_shouldReturnFalseWhenAppointmentNotFound() {
        when(appointmentRepository.findById(1L)).thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(new User()));
        
        boolean result = appointmentService.isAppointmentForUserEmail(1L, "test@example.com");
        
        assertFalse(result);
    }
    
    @Test
    void isAppointmentForUserEmail_shouldReturnFalseWhenUserNotFound() {
        Appointment appointment = createValidAppointment(1L, 2L);
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        
        boolean result = appointmentService.isAppointmentForUserEmail(1L, "test@example.com");
        
        assertFalse(result);
    }
    
    @Test
    void updateAppointmentStatus_shouldReturnTrueWhenSuccessful() {
        Appointment appointment = createValidAppointment(1L, 2L);
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);
        
        boolean result = appointmentService.updateAppointmentStatus(1L, "completed");
        
        assertTrue(result);
        assertEquals("Completed", appointment.getAppointmentStatus());
        verify(appointmentRepository).save(appointment);
    }
    
    @Test
    void updateAppointmentStatus_shouldReturnFalseWhenAppointmentNotFound() {
        when(appointmentRepository.findById(1L)).thenReturn(Optional.empty());
        
        boolean result = appointmentService.updateAppointmentStatus(1L, "completed");
        
        assertFalse(result);
        verify(appointmentRepository, never()).save(any());
    }
    
    @Test
    void updateAppointmentStatus_shouldThrowExceptionWhenErrorOccurs() {
        Appointment appointment = createValidAppointment(1L, 2L);
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any(Appointment.class))).thenThrow(new RuntimeException("Database error"));
        
        Exception exception = assertThrows(RuntimeException.class, () -> 
            appointmentService.updateAppointmentStatus(1L, "completed")
        );
        
        assertTrue(exception.getMessage().contains("Database error"));
    }
    
    @Test
    void isUserEmailMatching_shouldReturnTrueWhenMatches() {
        User user = new User();
        user.setEmail("test@example.com");
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        boolean result = appointmentService.isUserEmailMatching(1L, "test@example.com");
        
        assertTrue(result);
    }
    
    @Test
    void isUserEmailMatching_shouldReturnFalseWhenDifferent() {
        User user = new User();
        user.setEmail("test@example.com");
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        boolean result = appointmentService.isUserEmailMatching(1L, "different@example.com");
        
        assertFalse(result);
    }
    
    @Test
    void isUserEmailMatching_shouldThrowWhenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(NoSuchElementException.class, () -> 
            appointmentService.isUserEmailMatching(1L, "test@example.com")
        );
    }
    
    @Test
    void getAppointmentsByDoctorId_shouldReturnList() {
        List<AppointmentShowDTO> dtos = Arrays.asList(new AppointmentShowDTO(), new AppointmentShowDTO());
        when(appointmentRepository.findByDoctorIdWithUserName(2L)).thenReturn(dtos);
        
        List<AppointmentShowDTO> result = appointmentService.getAppointmentsByDoctorId(2L);
        
        assertEquals(2, result.size());
        verify(appointmentRepository).findByDoctorIdWithUserName(2L);
    }
}

