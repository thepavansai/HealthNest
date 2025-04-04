package com.healthnest.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.healthnest.dto.DoctorDTO;
import com.healthnest.service.DoctorService;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;
    @Autowired
    private ModelMapper modelMapper;

    // View Doctor Profile
    @GetMapping("/profile/{id}")
    public DoctorDTO getDoctorProfile(@PathVariable Long id) {

        return modelMapper.map(doctorService.getDoctorProfile(id),DoctorDTO.class);
    }

    // Update Doctor Profile
    @PutMapping("/profile/{id}")
    public String updateDoctorProfile(@PathVariable Long id, @RequestBody DoctorDTO doctorDTO) {
        return doctorService.updateDoctorProfile(id, doctorDTO);
    }

    // Update Availability
    @PutMapping("/{id}/availability")
    public String updateDoctorAvailability(@PathVariable Long id, @RequestParam String availability) {
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
