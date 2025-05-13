package com.healthnest.controller;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.healthnest.dto.DoctorDTO;
import com.healthnest.dto.DoctorSummaryDTO;
import com.healthnest.model.Doctor;
import com.healthnest.service.DoctorService;
import com.healthnest.service.JWTService;

@RestController
@RequestMapping("/v1/doctor")
@CrossOrigin(origins = "https://health-nest.netlify.app") 
public class DoctorController {
    @Autowired
    private DoctorService doctorService;
    
    @Autowired
    private ModelMapper modelMapper;
    
    @Autowired
    private JWTService jwtService;
    
    @GetMapping("/profile/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<DoctorDTO> getDoctorProfile(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
                
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String email = jwtService.extractUserEmail(token);
            String role = jwtService.extractUserRole(token);
            
            System.out.println("Accessing profile with role: " + role + " for doctor ID: " + id);
            
            // If user is a doctor, verify they're accessing their own profile
            if ("DOCTOR".equals(role)) {
                Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(email);
                if (!authenticatedDoctor.getDoctorId().equals(id)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
            }
            // Admins can access any doctor profile
            
            DoctorDTO doctorDTO = modelMapper.map(doctorService.getDoctorProfile(id), DoctorDTO.class);
            return ResponseEntity.ok(doctorDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/profile/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<String> updateDoctorProfile(
            @PathVariable Long id, 
            @RequestBody DoctorDTO doctorDTO,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String email = jwtService.extractUserEmail(token);
            
            // Verify that the doctor is updating their own profile
            Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(email);
            if (!authenticatedDoctor.getDoctorId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update your own profile");
            }
            
            String result = doctorService.updateDoctorProfile(id, doctorDTO);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update profile");
        }
    }

    @PatchMapping("/{id}/{availability}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<String> updateDoctorAvailability(
            @PathVariable Long id, 
            @PathVariable String availability,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String email = jwtService.extractUserEmail(token);
            
            // Verify that the doctor is updating their own availability
            Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(email);
            if (!authenticatedDoctor.getDoctorId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update your own availability");
            }
            
            String result = doctorService.updateDoctorAvailability(id, availability);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update availability");
        }
    }

    @PatchMapping("/{id}/fee/{consultation-fee}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<String> updateConsultationFee(
            @PathVariable Long id, 
            @PathVariable("consultation-fee") Double fee,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String email = jwtService.extractUserEmail(token);
            
            // Verify that the doctor is updating their own fee
            Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(email);
            if (!authenticatedDoctor.getDoctorId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update your own consultation fee");
            }
            
            String result = doctorService.updateConsultationFee(id, fee);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update consultation fee");
        }
    }

    @GetMapping("/{id}/rating")
    public ResponseEntity<Float> getDoctorRating(@PathVariable Long id) {
        try {
            Float rating = doctorService.getDoctorRating(id);
            return ResponseEntity.ok(rating);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
@GetMapping("/all")
public ResponseEntity<List<DoctorDTO>> getAllDoctors()
{
	  
    List<Doctor> doctors = doctorService.getAllDoctors();
    List<DoctorDTO> doctorDTOs = doctors.stream()
            .map(doctor -> modelMapper.map(doctor, DoctorDTO.class))
            .collect(Collectors.toList());
    return ResponseEntity.ok(doctorDTOs);
}
    @PatchMapping("/{id}/rating/{rating}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> updateDoctorRating(
            @PathVariable Long id, 
            @PathVariable Float rating,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            if (rating < 0 || rating > 5) {
                throw new IllegalArgumentException("Rating must be between 0 and 5");
            }
            
            // We don't need to verify user identity here since any authenticated user can rate a doctor
            // The service layer should handle validation that the user has had an appointment with this doctor
            
            String result = doctorService.updateDoctorRating(id, rating);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update rating");
        }
    }

//    @GetMapping("/{specialization}")
//    public ResponseEntity<List<DoctorDTO>> getDoctorsBySpecialization(@PathVariable String specialization) {
//        try {
//            List<Doctor> doctors = doctorService.findDoctorsBySpecialization(specialization);
//            List<DoctorDTO> doctorDTOs = doctors.stream()
//                    .map(doctor -> modelMapper.map(doctor, DoctorDTO.class))
//                    .collect(Collectors.toList());
//            return ResponseEntity.ok(doctorDTOs);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
    @GetMapping("/{specialization}")
    @PreAuthorize("hasAnyRole('USER', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<List<DoctorDTO>> getDoctorsBySpecialization(
            @PathVariable String specialization,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract and validate token
            String token = authHeader.substring(7);
            // You can use jwtService to validate the token if needed
            
            List<Doctor> doctors = doctorService.findDoctorsBySpecialization(specialization);
            List<DoctorDTO> doctorDTOs = doctors.stream()
                    .map(doctor -> modelMapper.map(doctor, DoctorDTO.class))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(doctorDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PutMapping("/{doctorId}/{specialization}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorDTO> addSpecialization(
            @PathVariable Long doctorId,
            @PathVariable String newSpecialization,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String email = jwtService.extractUserEmail(token);
            
            // Verify that the doctor is updating their own specialization
            Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(email);
            if (!authenticatedDoctor.getDoctorId().equals(doctorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            Doctor updatedDoctor = doctorService.addSpecialization(doctorId, newSpecialization);
            DoctorDTO updatedDoctorDTO = modelMapper.map(updatedDoctor, DoctorDTO.class);
            return ResponseEntity.ok(updatedDoctorDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/countalldoctors")
    public ResponseEntity<Integer> getAllDoctorsCount() {
        try {
            return ResponseEntity.ok(doctorService.getAllDoctors().size());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/changepassword/{doctorId}/{oldPassword}/{newPassword}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<String> changePassword(
            @PathVariable Long doctorId,
            @PathVariable String oldPassword,
            @PathVariable String newPassword,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String email = jwtService.extractUserEmail(token);
            
            // Verify that the doctor is changing their own password
            Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(email);
            if (!authenticatedDoctor.getDoctorId().equals(doctorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only change your own password");
            }
            
            if (newPassword == null || newPassword.length() < 6) {
                throw new IllegalArgumentException("New password must be at least 6 characters long");
            }
            
            String result = doctorService.changePassword(doctorId, oldPassword, newPassword);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to change password");
        }
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
    
    @GetMapping("/nearby")
    public ResponseEntity<List<DoctorDTO>> getNearbyDoctors(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam double radius) {
        
        try {
            List<Doctor> nearbyDoctors = doctorService.getNearbyDoctors(lat, lng, radius);
            List<DoctorDTO> doctorDTOs = nearbyDoctors.stream()
                    .map(doctor -> modelMapper.map(doctor, DoctorDTO.class))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(doctorDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<List<DoctorSummaryDTO>> getDoctorsSummary() {
        try {
            List<Doctor> doctors = doctorService.getAllDoctors();
            List<DoctorSummaryDTO> doctorSummaries = doctors.stream()
                    .map(doctor -> new DoctorSummaryDTO(
                            doctor.getDoctorName(), // Combine first and last name
                            doctor.getRating(),
                            doctor.getAddress(), // Make sure Doctor model has getLocation()
                            doctor.getHospitalName(), // Make sure Doctor model has getHospital()
                            doctor.getAvailability(), // Make sure Doctor model has getAvailability()
                            doctor.getSpecializedrole(), 
                            doctor.getGender(),
                            // Make sure Doctor model has getGender()
                            doctor.getStatus()// Add specialization - Make sure Doctor model has getSpecialization()
                    ))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(doctorSummaries);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

