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

    @Test
    void testGetAppointmentSummaries() {
        List<AppointmentSummaryDTO> mockList = List.of(
            new AppointmentSummaryDTO(1, 1,"Dr. A", 5, "1234567890", 500.0, 4.5f, "XYZ Hospital",
                    LocalDate.now(), LocalTime.now(), "Upcoming", "Test appointment"));

        when(appointmentRepository.findAppointmentSummariesByUserId(1)).thenReturn(mockList);

        List<AppointmentSummaryDTO> result = appointmentService.getAppointmentSummaries(1);

        assertEquals(1, result.size());
        assertEquals("Dr. A", result.get(0).getDoctorName());
    }

    @Test
    void testAcceptAppointment_Success() {
        Doctor doctor = new Doctor();
        doctor.setDoctorId(1);

        Appointment appointment = new Appointment();
        appointment.setAppointmentId(10);
        appointment.setDoctor(doctor);
        appointment.setAppointmentStatus("Pending");

        when(appointmentRepository.findById(10)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any())).thenReturn(appointment);

        Appointment result = appointmentService.acceptAppointment(10, 1);

        assertEquals("Upcoming", result.getAppointmentStatus());
    }

    @Test
    void testAcceptAppointment_Unauthorized() {
        Doctor doctor = new Doctor();
        doctor.setDoctorId(2);

        Appointment appointment = new Appointment();
        appointment.setAppointmentId(11);
        appointment.setDoctor(doctor);

        when(appointmentRepository.findById(11)).thenReturn(Optional.of(appointment));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> appointmentService.acceptAppointment(11, 1));
        assertEquals("You are not authorized to accept this appointment", exception.getMessage());
    }

    @Test
    void testRejectAppointment_Success() {
        Doctor doctor = new Doctor();
        doctor.setDoctorId(1);

        Appointment appointment = new Appointment();
        appointment.setAppointmentId(12);
        appointment.setDoctor(doctor);

        when(appointmentRepository.findById(12)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any())).thenReturn(appointment);

        Appointment result = appointmentService.rejectAppointment(12, 1);

        assertEquals("Cancelled", result.getAppointmentStatus());
    }

    @Test
    void testGetAppointments() {
        List<AppointmentShowDTO> dtoList = List.of(
                new AppointmentShowDTO(1, "Dr. A", "Cardiology", "John Doe", "1234567890", "Upcoming", "Checkup", LocalDate.now(), LocalTime.now())
        );

        when(appointmentRepository.findByDoctorIdWithUserName(1)).thenReturn(dtoList);

        List<AppointmentShowDTO> result = appointmentService.getAppointments(1);

        assertEquals(1, result.size());
        assertEquals("Dr. A", result.get(0).getDoctorName());
    }

    @Test
    void testGetAllAppointments() {
        when(appointmentRepository.findAllAppointments()).thenReturn(List.of());

        List<AppointmentShowDTO> result = appointmentService.getAllAppointments();

        assertNotNull(result);
    }

    @Test
    void testDeleteAllAppointments() {
        doNothing().when(appointmentRepository).deleteAll();
        String result = appointmentService.deleteAllAppointments();
        assertEquals("All appointments deleted successfully", result);
        verify(appointmentRepository, times(1)).deleteAll();
    }

    @Test
    void testDeleteAllAppointments_Error() {
        doThrow(new RuntimeException("Database error")).when(appointmentRepository).deleteAll();
        assertThrows(RuntimeException.class, () -> appointmentService.deleteAllAppointments());
    }

    @Test
    void testDeleteAppointment_Exists() {
        when(appointmentRepository.existsById(10)).thenReturn(true);
        doNothing().when(appointmentRepository).deleteById(10);

        String result = appointmentService.deleteAppointment(10);

        assertEquals("Appointment with ID 10 has been successfully deleted.", result);
    }

    @Test
    void testDeleteAppointment_NotExists() {
        when(appointmentRepository.existsById(99)).thenReturn(false);

        String result = appointmentService.deleteAppointment(99);

        assertEquals("Appointment with ID 99 does not exist.", result);
    }

    @Test
    void testGetTodayAppointmentsByDoctor() {
        LocalDate today = LocalDate.now();
        List<AppointmentShowDTO> allAppointments = List.of(
                new AppointmentShowDTO(1, "Dr. A", "General", "John Doe", "9999999999", "Upcoming", "Test",
                        today, LocalTime.NOON),
                new AppointmentShowDTO(2, "Dr. A", "General", "Jane Roe", "8888888888", "Upcoming", "Test",
                        today.minusDays(1), LocalTime.NOON)
        );

        when(appointmentRepository.findByDoctorIdWithUserName(1)).thenReturn(allAppointments);

        List<AppointmentShowDTO> result = appointmentService.getTodayAppointmentsByDoctor(1, today);

        assertEquals(1, result.size());
        assertEquals(today, result.get(0).getAppointmentDate());
    }
}
