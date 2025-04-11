package com.healthnest.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnest.dto.AppointmentShowDTO;
import com.healthnest.model.Appointment;
import com.healthnest.service.AppointmentService;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;
    
    @GetMapping("/doctor/{doctorId}/date/{todaydate}")
    public ResponseEntity<List<AppointmentShowDTO>> getTodayAppointmentsByDoctor(
        @PathVariable Integer doctorId,
        @PathVariable LocalDate todaydate
    ) {
        if (todaydate == null) {
            throw new IllegalArgumentException("Date cannot be null");
        }
        List<AppointmentShowDTO> appointments = appointmentService.getTodayAppointmentsByDoctor(doctorId, todaydate);
        return ResponseEntity.ok(appointments);
    }

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