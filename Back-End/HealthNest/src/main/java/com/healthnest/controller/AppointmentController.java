package com.healthnest.controller;

import com.healthnest.dto.AppointmentShowDTO;
import com.healthnest.model.Appointment;
import com.healthnest.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentShowDTO>> getAppointmentsByDoctor(@PathVariable Integer doctorId) {
        List<AppointmentShowDTO> appointments = appointmentService.getAppointments(doctorId);
        return ResponseEntity.ok(appointments);
    }
    @PostMapping("/{appointmentId}/accept/{doctorId}")
    public ResponseEntity<Appointment> acceptAppointment(
            @PathVariable Integer appointmentId,
            @PathVariable Integer doctorId) {

        Appointment updatedAppointment = appointmentService.acceptAppointment(appointmentId, doctorId);
        return ResponseEntity.ok(updatedAppointment);
    }

    @PostMapping("/{appointmentId}/reject/{doctorId}")
    public ResponseEntity<Appointment> rejectAppointment(
            @PathVariable Integer appointmentId,
            @PathVariable Integer doctorId) {

        Appointment updatedAppointment = appointmentService.rejectAppointment(appointmentId, doctorId);
        return ResponseEntity.ok(updatedAppointment);
    }
}