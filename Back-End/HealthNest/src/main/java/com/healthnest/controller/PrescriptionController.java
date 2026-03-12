package com.healthnest.controller;

import com.healthnest.dto.PrescriptionDTO;
import com.healthnest.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/prescriptions")
@CrossOrigin(origins = "http://localhost:3000")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<String> addPrescription(@RequestBody PrescriptionDTO prescriptionDTO) {
        try {
            prescriptionService.savePrescription(prescriptionDTO);
            return ResponseEntity.ok("Prescription saved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save prescription: " + e.getMessage());
        }
    }

    @GetMapping("/appointment/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'USER', 'ADMIN')")
    public ResponseEntity<?> getPrescriptionByAppointment(@PathVariable Long id) {
        try {
            PrescriptionDTO prescription = prescriptionService.getPrescriptionByAppointmentId(id);
            return ResponseEntity.ok(prescription);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}