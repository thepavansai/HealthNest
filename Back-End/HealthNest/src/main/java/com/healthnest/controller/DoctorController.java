package com.healthnest.controller;

import com.healthnest.dto.DoctorDTO;
import com.healthnest.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // View Doctor Profile
    @GetMapping("/profile/{id}")
    public DoctorDTO getDoctorProfile(@PathVariable Long id) {
        return doctorService.getDoctorProfile(id);
    }

    // Update Doctor Profile
    @PutMapping("/profile/{id}")
    public DoctorDTO updateDoctorProfile(@PathVariable Long id, @RequestBody DoctorDTO doctorDTO) {
        return doctorService.updateDoctorProfile(id, doctorDTO);
    }

    // Update Availability
    @PutMapping("/{id}/availability")
    public String updateDoctorAvailability(@PathVariable Long id, @RequestParam boolean availability) {
        return doctorService.updateDoctorAvailability(id, availability);
    }

    // Update Consultation Fee
    @PutMapping("/{id}/consultation-fee")
    public String updateConsultationFee(@PathVariable Long id, @RequestParam Double fee) {
        return doctorService.updateConsultationFee(id, fee);
    }

    // View Ratings & Feedback
    @GetMapping("/{id}/reviews")
    public String getDoctorReviews(@PathVariable Long id) {
        return doctorService.getDoctorReviews(id);
    }
}
