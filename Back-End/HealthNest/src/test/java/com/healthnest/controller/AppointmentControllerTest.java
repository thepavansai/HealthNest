package com.healthnest.controller;

import com.healthnest.dto.AppointmentShowDTO;
import com.healthnest.model.Appointment;
import com.healthnest.service.AppointmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AppointmentControllerTest {

    private AppointmentController appointmentController;
    private AppointmentService appointmentService;

    @BeforeEach
    void setUp() {
        appointmentService = mock(AppointmentService.class);
        appointmentController = new AppointmentController();

        // Inject mock via reflection since it's private and no setter
        try {
            var serviceField = AppointmentController.class.getDeclaredField("appointmentService");
            serviceField.setAccessible(true);
            serviceField.set(appointmentController, appointmentService);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testGetTodayAppointmentsByDoctor() {
        Integer doctorId = 1;
        LocalDate today = LocalDate.now();

        AppointmentShowDTO dto = new AppointmentShowDTO();
        dto.setDoctorName("Dr. John");

        when(appointmentService.getTodayAppointmentsByDoctor(doctorId, today))
                .thenReturn(List.of(dto));

        ResponseEntity<List<AppointmentShowDTO>> response = appointmentController.getTodayAppointmentsByDoctor(doctorId, today);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
        assertEquals("Dr. John", response.getBody().get(0).getDoctorName());
    }

    @Test
    void testGetAppointmentsByDoctor() {
        Integer doctorId = 1;

        AppointmentShowDTO dto1 = new AppointmentShowDTO();
        dto1.setDoctorName("Dr. Smith");

        AppointmentShowDTO dto2 = new AppointmentShowDTO();
        dto2.setDoctorName("Dr. Smith");

        when(appointmentService.getAppointments(doctorId))
                .thenReturn(Arrays.asList(dto1, dto2));

        ResponseEntity<List<AppointmentShowDTO>> response = appointmentController.getAppointmentsByDoctor(doctorId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        assertEquals("Dr. Smith", response.getBody().get(0).getDoctorName());
    }

    @Test
    void testAcceptAppointment() {
        Integer appointmentId = 10;
        Integer doctorId = 5;

        Appointment mockAppointment = new Appointment();
        mockAppointment.setAppointmentId(appointmentId);

        when(appointmentService.acceptAppointment(appointmentId, doctorId))
                .thenReturn(mockAppointment);

        ResponseEntity<Appointment> response = appointmentController.acceptAppointment(appointmentId, doctorId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(appointmentId, response.getBody().getAppointmentId());
    }

    @Test
    void testRejectAppointment() {
        Integer appointmentId = 20;
        Integer doctorId = 3;

        Appointment mockAppointment = new Appointment();
        mockAppointment.setAppointmentId(appointmentId);

        when(appointmentService.rejectAppointment(appointmentId, doctorId))
                .thenReturn(mockAppointment);

        ResponseEntity<Appointment> response = appointmentController.rejectAppointment(appointmentId, doctorId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(appointmentId, response.getBody().getAppointmentId());
    }
}
