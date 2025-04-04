package com.healthnest.controller;

import java.util.List;
import java.util.Map;

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
import com.healthnest.service.AppointmentService;
import com.healthnest.service.DoctorService;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private AppointmentService appointmentService;

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
    @GetMapping("/{id}/rating")
    public Float getDoctorReviews(@PathVariable Long id) {
        return doctorService.getDoctorRating(id);
    }
    
//    @GetMapping("/user/{userId}")
//    public List<Map<String, Object>> getAppointmentsForUser(@PathVariable Integer userId) {
//        return appointmentService.getAppointmentsForUser(userId);
//    }

//    // 2️⃣ Get all appointments for a doctor (doctor-side)
//    @GetMapping("/doctor/{doctorId}")
//    public List<Map<String, Object>> getAppointmentsForDoctor(@PathVariable Long doctorId) {
//        return appointmentService.getAppointmentsForDoctor(doctorId);
//    }

    // 3️⃣ Get appointments for a doctor filtered by status
    @GetMapping("/appointments/{doctorId}/status/{status}")
    public List<Map<String, Object>> getAppointmentsForDoctorByStatus(
            @PathVariable Long doctorId,
            @PathVariable String status) {
        return appointmentService.getAppointmentsForDoctorByStatus(doctorId, status);
    }

    // 4️⃣ Get appointments for a doctor by specific user
    @GetMapping("/appointments/{doctorId}/user/{userId}")
    public List<Map<String, Object>> getAppointmentsForDoctorByUser(
            @PathVariable Long doctorId,
            @PathVariable Integer userId) {
        return appointmentService.getAppointmentsForDoctorByUser(doctorId, userId);
    }
}
