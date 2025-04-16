package com.healthnest.controller;

import com.healthnest.dto.AppointmentShowDTO;
import com.healthnest.model.Appointment;
import com.healthnest.service.AppointmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
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

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getTodayAppointmentsByDoctor_shouldReturnAppointments() {
        Integer doctorId = 1;
        LocalDate today = LocalDate.now();
        List<AppointmentShowDTO> dtos = Arrays.asList(new AppointmentShowDTO(), new AppointmentShowDTO());
        when(appointmentService.getTodayAppointmentsByDoctor(doctorId, today)).thenReturn(dtos);

        ResponseEntity<List<AppointmentShowDTO>> response = appointmentController.getTodayAppointmentsByDoctor(doctorId, today);

        assertEquals(2, response.getBody().size());
        verify(appointmentService).getTodayAppointmentsByDoctor(doctorId, today);
    }

    @Test
    void getTodayAppointmentsByDoctor_shouldThrowExceptionIfDateNull() {
        Integer doctorId = 1;
        assertThrows(IllegalArgumentException.class, () ->
            appointmentController.getTodayAppointmentsByDoctor(doctorId, null)
        );
    }

    @Test
    void getAppointmentsByDoctor_shouldReturnAppointments() {
        Integer doctorId = 2;
        List<AppointmentShowDTO> dtos = Collections.singletonList(new AppointmentShowDTO());
        when(appointmentService.getAppointments(doctorId)).thenReturn(dtos);

        ResponseEntity<List<AppointmentShowDTO>> response = appointmentController.getAppointmentsByDoctor(doctorId);

        assertEquals(1, response.getBody().size());
        verify(appointmentService).getAppointments(doctorId);
    }

    @Test
    void acceptAppointment_shouldReturnUpdatedAppointment() {
        Integer appointmentId = 10, doctorId = 5;
        Appointment appointment = new Appointment();
        when(appointmentService.acceptAppointment(appointmentId, doctorId)).thenReturn(appointment);

        ResponseEntity<Appointment> response = appointmentController.acceptAppointment(appointmentId, doctorId);

        assertEquals(appointment, response.getBody());
        verify(appointmentService).acceptAppointment(appointmentId, doctorId);
    }

    @Test
    void rejectAppointment_shouldReturnUpdatedAppointment() {
        Integer appointmentId = 11, doctorId = 6;
        Appointment appointment = new Appointment();
        when(appointmentService.rejectAppointment(appointmentId, doctorId)).thenReturn(appointment);

        ResponseEntity<Appointment> response = appointmentController.rejectAppointment(appointmentId, doctorId);

        assertEquals(appointment, response.getBody());
        verify(appointmentService).rejectAppointment(appointmentId, doctorId);
    }

    @Test
    void getAllDoctorsCount_shouldReturnCount() {
        when(appointmentService.getAllAppointments()).thenReturn(Arrays.asList(new AppointmentShowDTO(), new AppointmentShowDTO()));

        ResponseEntity<Integer> response = appointmentController.getAllDoctorsCount();

        assertEquals(2, response.getBody());
        verify(appointmentService).getAllAppointments();
    }

    @Test
    void changeStatus_shouldReturnStatusString() {
        Integer appointmentId = 7;
        String setStatus = "Completed";
        when(appointmentService.changeStatus(appointmentId, setStatus)).thenReturn("Status Updated");

        ResponseEntity<String> response = appointmentController.changeStatus(appointmentId, setStatus);

        assertEquals("Status Updated", response.getBody());
        verify(appointmentService).changeStatus(appointmentId, setStatus);
    }
}