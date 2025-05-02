package com.healthnest.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnest.dto.AppointmentShowDTO;
import com.healthnest.dto.DoctorDTO;
import com.healthnest.dto.FeedBackDTO;
import com.healthnest.dto.UserDTO;
import com.healthnest.exception.DoctorNotFoundException;
import com.healthnest.exception.UserNotFoundException;
import com.healthnest.model.Doctor;
import com.healthnest.model.User;
import com.healthnest.service.AppointmentService;
import com.healthnest.service.DoctorService;
import com.healthnest.service.FeedBackService;
import com.healthnest.service.JWTService;
import com.healthnest.service.UserService;

@CrossOrigin(origins = {"http://localhost:3000", "https://health-nest.netlify.app/"})
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired
    private UserService userService;
    
    @Autowired
    private DoctorService doctorService;
    
    @Autowired
    private AppointmentService appointmentService;
    
    @Autowired
    private ModelMapper modelMapper;
    
    @Autowired
    private FeedBackService feedBackService;
    
    @Autowired
    private JWTService jwtService;

   

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        try {
            // Verify admin role
            String token = authHeader.substring(7);
            String role = jwtService.extractUserRole(token);
            
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            List<User> users = userService.getAllUsers();
            List<UserDTO> userDTOs = users.stream()
                    .map(user -> modelMapper.map(user, UserDTO.class))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors(@RequestHeader("Authorization") String authHeader) {
        try {
//             Verify admin role
            String token = authHeader.substring(7);
            String role = jwtService.extractUserRole(token);
            
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            List<Doctor> doctors = doctorService.getAllDoctors();
            List<DoctorDTO> doctorDTOs = doctors.stream()
                    .map(doctor -> modelMapper.map(doctor, DoctorDTO.class))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(doctorDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/users/delete")
    public ResponseEntity<String> deleteAllUsers(@RequestHeader("Authorization") String authHeader) {
        try {
            // Verify admin role
            String token = authHeader.substring(7);
            String role = jwtService.extractUserRole(token);
            
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin access required");
            }
            
            String result = userService.deleteAllUsers();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete all users: " + e.getMessage());
        }
    }

    @DeleteMapping("/doctors/delete")
    public ResponseEntity<String> deleteAllDoctors(@RequestHeader("Authorization") String authHeader) {
        try {
            // Verify admin role
            String token = authHeader.substring(7);
            String role = jwtService.extractUserRole(token);
            
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin access required");
            }
            
            String result = doctorService.deleteAllDoctors();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete all doctors: " + e.getMessage());
        }
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentShowDTO>> getAllAppointments(@RequestHeader("Authorization") String authHeader) {
        try {
            // Verify admin role
            String token = authHeader.substring(7);
            String role = jwtService.extractUserRole(token);
            
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            List<AppointmentShowDTO> appointments = appointmentService.getAllAppointments();
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/appointments/delete")
    public ResponseEntity<String> deleteAppointment(@RequestHeader("Authorization") String authHeader) {
        try {
            // Verify admin role
            String token = authHeader.substring(7);
            String role = jwtService.extractUserRole(token);
            
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin access required");
            }
            
            String result = appointmentService.deleteAllAppointments();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete all appointments: " + e.getMessage());
        }
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<String> deleteAppointment(
            @PathVariable("id") Long appointmentId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Verify admin role
            String token = authHeader.substring(7);
            String role = jwtService.extractUserRole(token);
            
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin access required");
            }
            
            String result = appointmentService.deleteAppointment(appointmentId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete appointment: " + e.getMessage());
        }
    }

    @GetMapping("/feedbacks")
    public ResponseEntity<List<FeedBackDTO>> getAllFeedBacks() {
        try {
            // Verify admin role
//            String token = authHeader.substring(7);
//            String role = jwtService.extractUserRole(token);
//            
//            if (!"ADMIN".equals(role)) {
//                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//            }
            
            List<FeedBackDTO> feedbacks = feedBackService.getAllFeedBack();
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/doctors/{doctorId}/accept")
    public ResponseEntity<String> acceptDoctor(
            @PathVariable Long doctorId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Verify admin role
            String token = authHeader.substring(7);
            String role = jwtService.extractUserRole(token);
            
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin access required");
            }
            
            doctorService.updateDoctorStatus(doctorId, 1);
            return ResponseEntity.ok("Doctor accepted successfully");
        } catch (DoctorNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to accept doctor: " + e.getMessage());
        }
    }

    @PutMapping("/doctors/{doctorId}/reject")
    public ResponseEntity<String> rejectDoctor(
            @PathVariable Long doctorId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Verify admin role
            String token = authHeader.substring(7);
            String role = jwtService.extractUserRole(token);
            
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin access required");
            }
            
            doctorService.updateDoctorStatus(doctorId, -1);
            return ResponseEntity.ok("Doctor rejected successfully");
        } catch (DoctorNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to reject doctor: " + e.getMessage());
        }
    }

    @DeleteMapping("/doctors/{doctorId}")
    public ResponseEntity<String> deleteDoctor(
            @PathVariable Long doctorId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Verify admin role
            String token = authHeader.substring(7);
            String role = jwtService.extractUserRole(token);
            
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin access required");
            }
            
            doctorService.deleteDoctor(doctorId);
            return ResponseEntity.ok("Doctor deleted successfully");
        } catch (DoctorNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete doctor: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Verify admin role
            String token = authHeader.substring(7);
            String role = jwtService.extractUserRole(token);
            
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin access required");
            }
            
            userService.deleteAccount(userId);
            return ResponseEntity.ok("User deleted successfully");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete user: " + e.getMessage());
        }
    }
}
