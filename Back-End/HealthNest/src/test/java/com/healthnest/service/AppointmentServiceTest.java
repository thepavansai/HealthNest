package com.healthnest.service;

import com.healthnest.dto.AppointmentShowDTO;
import com.healthnest.dto.AppointmentSummaryDTO;
import com.healthnest.model.Appointment;
import com.healthnest.model.Doctor;
import com.healthnest.model.User;
import com.healthnest.repository.AppointmentRepository;
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

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private Appointment createValidAppointment(Integer appointmentId, Integer doctorId) {
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
        user.setUserId(1);
        appointment.setUser(user);
        return appointment;
    }

    @Test
    void getAppointmentSummaries_shouldReturnList() {
        List<AppointmentSummaryDTO> dtos = Arrays.asList(new AppointmentSummaryDTO(), new AppointmentSummaryDTO());
        when(appointmentRepository.findAppointmentSummariesByUserId(1)).thenReturn(dtos);
        List<AppointmentSummaryDTO> result = appointmentService.getAppointmentSummaries(1);
        assertEquals(2, result.size());
        verify(appointmentRepository).findAppointmentSummariesByUserId(1);
    }

    @Test
    void acceptAppointment_shouldUpdateStatus() {
        Appointment appointment = createValidAppointment(1, 2);
        when(appointmentRepository.findById(1)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any())).thenReturn(appointment);

        Appointment result = appointmentService.acceptAppointment(1, 2);

        assertEquals("Upcoming", result.getAppointmentStatus());
        verify(appointmentRepository).save(appointment);
    }

    @Test
    void acceptAppointment_shouldThrowIfNullIds() {
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            appointmentService.acceptAppointment(null, 1)
        );
        assertTrue(ex.getMessage().contains("cannot be null"));
    }

    @Test
    void acceptAppointment_shouldThrowIfNotFound() {
        when(appointmentRepository.findById(1)).thenReturn(Optional.empty());
        Exception ex = assertThrows(RuntimeException.class, () ->
            appointmentService.acceptAppointment(1, 2)
        );
        assertTrue(ex.getMessage().contains("not found"));
    }

    @Test
    void acceptAppointment_shouldThrowIfUnauthorized() {
        Appointment appointment = createValidAppointment(1, 3);
        when(appointmentRepository.findById(1)).thenReturn(Optional.of(appointment));
        Exception ex = assertThrows(RuntimeException.class, () ->
            appointmentService.acceptAppointment(1, 2)
        );
        assertTrue(ex.getMessage().contains("not authorized"));
    }

    @Test
    void acceptAppointment_shouldThrowIfInvalidAppointment() {
        Appointment appointment = createValidAppointment(1, 2);
        appointment.setAppointmentDate(null);
        when(appointmentRepository.findById(1)).thenReturn(Optional.of(appointment));
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            appointmentService.acceptAppointment(1, 2)
        );
        assertTrue(ex.getMessage().contains("date cannot be null"));
    }

    @Test
    void acceptAppointment_shouldThrowIfAppointmentDateInPast() {
        Appointment appointment = createValidAppointment(1, 2);
        appointment.setAppointmentDate(LocalDate.now().minusDays(1));
        when(appointmentRepository.findById(1)).thenReturn(Optional.of(appointment));
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            appointmentService.acceptAppointment(1, 2)
        );
        assertTrue(ex.getMessage().contains("in the past"));
    }

    @Test
    void acceptAppointment_shouldThrowIfAppointmentTimeNull() {
        Appointment appointment = createValidAppointment(1, 2);
        appointment.setAppointmentTime(null);
        when(appointmentRepository.findById(1)).thenReturn(Optional.of(appointment));
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            appointmentService.acceptAppointment(1, 2)
        );
        assertTrue(ex.getMessage().contains("time cannot be null"));
    }

    @Test
    void acceptAppointment_shouldThrowIfDescriptionEmpty() {
        Appointment appointment = createValidAppointment(1, 2);
        appointment.setDescription("   ");
        when(appointmentRepository.findById(1)).thenReturn(Optional.of(appointment));
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            appointmentService.acceptAppointment(1, 2)
        );
        assertTrue(ex.getMessage().contains("description cannot be empty"));
    }

    @Test
    void acceptAppointment_shouldThrowIfUserNull() {
        Appointment appointment = createValidAppointment(1, 2);
        appointment.setUser(null);
        when(appointmentRepository.findById(1)).thenReturn(Optional.of(appointment));
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            appointmentService.acceptAppointment(1, 2)
        );
        assertTrue(ex.getMessage().contains("User cannot be null"));
    }

    @Test
    void acceptAppointment_shouldThrowIfDoctorNull() {
        Appointment appointment = createValidAppointment(1, 2);
        appointment.setDoctor(null);
        when(appointmentRepository.findById(1)).thenReturn(Optional.of(appointment));
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
            appointmentService.acceptAppointment(1, 2)
        );
        assertTrue(ex.getMessage().contains("Doctor cannot be null"));
    }

    @Test
    void rejectAppointment_shouldUpdateStatus() {
        Appointment appointment = createValidAppointment(1, 2);
        when(appointmentRepository.findById(1)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any())).thenReturn(appointment);

        Appointment result = appointmentService.rejectAppointment(1, 2);

        assertEquals("Cancelled", result.getAppointmentStatus());
        verify(appointmentRepository).save(appointment);
    }

    @Test
    void rejectAppointment_shouldThrowIfNotFound() {
        when(appointmentRepository.findById(1)).thenReturn(Optional.empty());
        Exception ex = assertThrows(RuntimeException.class, () ->
            appointmentService.rejectAppointment(1, 2)
        );
        assertTrue(ex.getMessage().contains("not found"));
    }

    @Test
    void rejectAppointment_shouldThrowIfUnauthorized() {
        Appointment appointment = createValidAppointment(1, 3);
        when(appointmentRepository.findById(1)).thenReturn(Optional.of(appointment));
        Exception ex = assertThrows(RuntimeException.class, () ->
            appointmentService.rejectAppointment(1, 2)
        );
        assertTrue(ex.getMessage().contains("not authorized"));
    }

    @Test
    void getAppointments_shouldReturnList() {
        List<AppointmentShowDTO> dtos = Arrays.asList(new AppointmentShowDTO(), new AppointmentShowDTO());
        when(appointmentRepository.findByDoctorIdWithUserName(2)).thenReturn(dtos);
        List<AppointmentShowDTO> result = appointmentService.getAppointments(2);
        assertEquals(2, result.size());
        verify(appointmentRepository).findByDoctorIdWithUserName(2);
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
        when(appointmentRepository.existsById(1)).thenReturn(true);
        doNothing().when(appointmentRepository).deleteById(1);
        String result = appointmentService.deleteAppointment(1);
        assertTrue(result.contains("successfully"));
        verify(appointmentRepository).deleteById(1);
    }

    @Test
    void deleteAppointment_shouldReturnNotExistIfMissing() {
        when(appointmentRepository.existsById(1)).thenReturn(false);
        String result = appointmentService.deleteAppointment(1);
        assertTrue(result.contains("does not exist"));
        verify(appointmentRepository, never()).deleteById(1);
    }

    @Test
    void getTodayAppointmentsByDoctor_shouldFilterByDate() {
        AppointmentShowDTO dto1 = mock(AppointmentShowDTO.class);
        AppointmentShowDTO dto2 = mock(AppointmentShowDTO.class);
        LocalDate today = LocalDate.now();
        when(dto1.getAppointmentDate()).thenReturn(today);
        when(dto2.getAppointmentDate()).thenReturn(today.plusDays(1));
        when(appointmentRepository.findByDoctorIdWithUserName(2)).thenReturn(Arrays.asList(dto1, dto2));
        List<AppointmentShowDTO> result = appointmentService.getTodayAppointmentsByDoctor(2, today);
        assertEquals(1, result.size());
        assertEquals(dto1, result.get(0));
    }

    @Test
    void changeStatus_shouldUpdateStatus() {
        Appointment appointment = createValidAppointment(1, 2);
        when(appointmentRepository.findById(1)).thenReturn(Optional.of(appointment));
        String result = appointmentService.changeStatus(1, "Completed");
        assertEquals("Sucessfully Completed", result);
        assertEquals("Completed", appointment.getAppointmentStatus());
    }

    @Test
    void changeStatus_shouldThrowIfAppointmentNotFound() {
        when(appointmentRepository.findById(1)).thenReturn(Optional.empty());
        assertThrows(NoSuchElementException.class, () ->
            appointmentService.changeStatus(1, "Completed")
        );
    }
}