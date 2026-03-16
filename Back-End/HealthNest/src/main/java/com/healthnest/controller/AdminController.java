package com.healthnest.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.healthnest.dto.*;
import com.healthnest.exception.DoctorNotFoundException;
import com.healthnest.exception.UserNotFoundException;
import com.healthnest.model.Doctor;
import com.healthnest.model.User;
import com.healthnest.service.*;

import lombok.extern.slf4j.Slf4j;

@Slf4j // Enables the 'log' object
@CrossOrigin(origins = "https://health-nest.netlify.app")
@RestController
@RequestMapping("/v1/admin")
@PreAuthorize("hasRole('ADMIN')") // Security is handled here automatically
public class AdminController {

    @Autowired private UserService userService;
    @Autowired private DoctorService doctorService;
    @Autowired private AppointmentService appointmentService;
    @Autowired private ModelMapper modelMapper;
    @Autowired private FeedBackService feedBackService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        log.info("Admin fetching all registered users");
        try {
            List<User> users = userService.getAllUsers();
            List<UserDTO> userDTOs = users.stream()
                    .map(user -> modelMapper.map(user, UserDTO.class))
                    .collect(Collectors.toList());
            log.debug("Successfully retrieved {} users", userDTOs.size());
            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            log.error("Error occurred while fetching users: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        log.info("Admin fetching all registered doctors");
        try {
            List<Doctor> doctors = doctorService.getAllDoctors();
            List<DoctorDTO> doctorDTOs = doctors.stream()
                    .map(doctor -> modelMapper.map(doctor, DoctorDTO.class))
                    .collect(Collectors.toList());
            log.debug("Successfully retrieved {} doctors", doctorDTOs.size());
            return ResponseEntity.ok(doctorDTOs);
        } catch (Exception e) {
            log.error("Error occurred while fetching doctors: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/users/delete")
    public ResponseEntity<String> deleteAllUsers() {
        log.warn("CRITICAL: Admin initiated deletion of ALL users");
        try {
            String result = userService.deleteAllUsers();
            log.info("Successfully deleted all users. Result: {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Mass user deletion failed: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/doctors/delete")
    public ResponseEntity<String> deleteAllDoctors() {
        log.warn("CRITICAL: Admin initiated deletion of ALL doctors");
        try {
            String result = doctorService.deleteAllDoctors();
            log.info("Successfully deleted all doctors. Result: {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Mass doctor deletion failed: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed: " + e.getMessage());
        }
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentShowDTO>> getAllAppointments() {
        log.info("Admin fetching all system appointments");
        try {
            List<AppointmentShowDTO> appointments = appointmentService.getAllAppointments();
            log.debug("Retrieved {} total appointments", appointments.size());
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            log.error("Error fetching appointments: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable("id") Long appointmentId) {
        log.info("Admin deleting appointment ID: {}", appointmentId);
        try {
            String result = appointmentService.deleteAppointment(appointmentId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Failed to delete appointment {}: ", appointmentId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Deletion failed");
        }
    }

    @GetMapping("/feedbacks")
    public ResponseEntity<List<FeedBackDTO>> getAllFeedBacks() {
        log.info("Admin fetching all feedback records");
        try {
            List<FeedBackDTO> feedbacks = feedBackService.getAllFeedBack();
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            log.error("Feedback retrieval failed: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/doctors/{doctorId}/accept")
    public ResponseEntity<String> acceptDoctor(@PathVariable Long doctorId) {
        log.info("Admin accepting registration for doctor ID: {}", doctorId);
        try {
            doctorService.updateDoctorStatus(doctorId, 1);
            log.info("Doctor {} status updated to ACCEPTED", doctorId);
            return ResponseEntity.ok("Doctor accepted successfully");
        } catch (DoctorNotFoundException e) {
            log.warn("Attempted to accept non-existent doctor ID: {}", doctorId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error accepting doctor {}: ", doctorId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal error");
        }
    }

    @PutMapping("/doctors/{doctorId}/reject")
    public ResponseEntity<String> rejectDoctor(@PathVariable Long doctorId) {
        log.info("Admin REJECTING registration for doctor ID: {}", doctorId);
        try {
            doctorService.updateDoctorStatus(doctorId, -1);
            return ResponseEntity.ok("Doctor rejected successfully");
        } catch (DoctorNotFoundException e) {
            log.warn("Attempted to reject non-existent doctor ID: {}", doctorId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error rejecting doctor {}: ", doctorId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal error");
        }
    }

    @DeleteMapping("/doctors/{doctorId}")
    public ResponseEntity<String> deleteDoctor(@PathVariable Long doctorId) {
        log.warn("Admin deleting doctor record ID: {}", doctorId);
        try {
            doctorService.deleteDoctor(doctorId);
            return ResponseEntity.ok("Doctor deleted successfully");
        } catch (DoctorNotFoundException e) {
            log.warn("Failed to delete doctor {}: Not found", doctorId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Critical error deleting doctor {}: ", doctorId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Deletion failed");
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        log.warn("Admin deleting user account ID: {}", userId);
        try {
            userService.deleteAccount(userId);
            return ResponseEntity.ok("User deleted successfully");
        } catch (UserNotFoundException e) {
            log.warn("Failed to delete user {}: Not found", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Critical error deleting user {}: ", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Deletion failed");
        }
    }
}