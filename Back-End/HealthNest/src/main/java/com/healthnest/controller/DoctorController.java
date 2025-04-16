package com.healthnest.controller;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnest.dto.DoctorDTO;
import com.healthnest.model.Doctor;
import com.healthnest.service.DoctorService;

@RestController
@RequestMapping("/doctor")
@CrossOrigin(origins = "http://localhost:3000") 
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private ModelMapper modelMapper;
   
    @GetMapping("/profile/{id}")
    public ResponseEntity<DoctorDTO> getDoctorProfile(@PathVariable Long id) {
        DoctorDTO doctorDTO = modelMapper.map(doctorService.getDoctorProfile(id), DoctorDTO.class);
        return ResponseEntity.ok(doctorDTO);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<String> updateDoctorProfile(@PathVariable Long id, @RequestBody DoctorDTO doctorDTO) {
        String result = doctorService.updateDoctorProfile(id, doctorDTO);
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/{id}/{availability}")
    public ResponseEntity<String> updateDoctorAvailability(@PathVariable Long id, @PathVariable String availability) {
        String result = doctorService.updateDoctorAvailability(id, availability);
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/{id}/fee/{consultation-fee}")
    public ResponseEntity<String> updateConsultationFee(@PathVariable Long id, @PathVariable("consultation-fee") Double fee) {
        String result = doctorService.updateConsultationFee(id, fee);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}/rating")
    public ResponseEntity<Float> getDoctorRating(@PathVariable Long id) {
        Float rating = doctorService.getDoctorRating(id);
        return ResponseEntity.ok(rating);
    }

    @PatchMapping("/{id}/rating/{rating}")
    public ResponseEntity<String> updateDoctorRating(@PathVariable Long id, @PathVariable Float rating) {
        if (rating < 0 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 0 and 5");
        }
        String result = doctorService.updateDoctorRating(id, rating);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{specialization}")
    public ResponseEntity<List<DoctorDTO>> getDoctorsBySpecialization(@PathVariable String specialization) {
        List<Doctor> doctors = doctorService.findDoctorsBySpecialization(specialization);
        List<DoctorDTO> doctorDTOs = doctors.stream()
                .map(doctor -> modelMapper.map(doctor, DoctorDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctorDTOs);
    }

    @PutMapping("/{doctorId}/{specialization}")
    public ResponseEntity<DoctorDTO> addSpecialization(@PathVariable Long doctorId,@PathVariable String newSpecialization) {
        Doctor updatedDoctor = doctorService.addSpecialization(doctorId, newSpecialization);
        DoctorDTO updatedDoctorDTO = modelMapper.map(updatedDoctor, DoctorDTO.class);
        return ResponseEntity.ok(updatedDoctorDTO);
    }
    @GetMapping("/countalldoctors")
	public ResponseEntity<Integer> getAllDoctorsCount()
	{
		return ResponseEntity.ok(doctorService.getAllDoctors().size());
	}

    @PatchMapping("/changepassword/{doctorId}/{oldPassword}/{newPassword}")
    public ResponseEntity<String> changePassword(
            @PathVariable Long doctorId,
            @PathVariable String oldPassword,
            @PathVariable String newPassword) {
        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters long");
        }
        String result = doctorService.changePassword(doctorId, oldPassword, newPassword);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/setnewpassword")
    public ResponseEntity<String> setNewPassword(@RequestBody HashMap<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");
      
        
        if (email == null || email.isEmpty() || !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters long");
        }
        
        try {
            boolean passwordSet = doctorService.setNewPassword(email, newPassword);
            if (passwordSet) {
                return ResponseEntity.ok("Password has been updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update password");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to set new password: " + e.getMessage());
        }
    }

    @PostMapping("/check-email")
    public ResponseEntity<String> checkEmailExists(@RequestBody HashMap<String, String> request) {
        String email = request.get("email");
        
        if (email == null || email.isEmpty() || !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        try {
            boolean exists = doctorService.isDoctorEmailRegistered(email);
            if (exists) {
                return ResponseEntity.ok("Email exists");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error checking email: " + e.getMessage());
        }
    }
}