package com.healthnest.controller;

import com.healthnest.dto.AppointmentShowDTO;
import com.healthnest.model.Appointment;
import com.healthnest.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @PostMapping("/{appointmentId}/status/{doctorId}/{status}")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Integer appointmentId,
            @PathVariable Integer doctorId,
            @PathVariable String status) {

        Appointment updatedAppointment;

        switch (status.toLowerCase()) {
            case "accepted":
                updatedAppointment = appointmentService.acceptAppointment(appointmentId, doctorId);
                break;
            case "rejected":
                updatedAppointment = appointmentService.rejectAppointment(appointmentId, doctorId);
                break;
            default:
                return ResponseEntity.badRequest().body(null); // Invalid status
        }

        return ResponseEntity.ok(updatedAppointment);
    }
}