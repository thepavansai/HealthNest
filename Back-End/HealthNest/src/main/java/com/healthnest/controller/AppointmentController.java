package com.healthnest.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnest.dto.AppointmentShowDTO;
import com.healthnest.dto.AppointmentSummaryDTO;
import com.healthnest.exception.AppointmentNotFoundException;
import com.healthnest.model.Appointment;
import com.healthnest.model.Doctor;
import com.healthnest.service.AppointmentService;
import com.healthnest.service.DoctorService;
import com.healthnest.service.JWTService;

@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = {"http://localhost:3000", "https://health-nest.netlify.app/"})
@RestController
@RequestMapping("/appointments")
public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;
    
    @Autowired
    private DoctorService doctorService;
    
    @Autowired
    private JWTService jwtService;
    
    @GetMapping("/doctor/{doctorId}/date/{todaydate}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<AppointmentShowDTO>> getTodayAppointmentsByDoctor(
            @PathVariable Integer doctorId,
            @PathVariable LocalDate todaydate,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String email = jwtService.extractUserEmail(token);
            
            // Verify that the doctor is accessing their own appointments
            Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(email);
            if (!authenticatedDoctor.getDoctorId().equals(Long.valueOf(doctorId))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            if (todaydate == null) {
                throw new IllegalArgumentException("Date cannot be null");
            }
            
            List<AppointmentShowDTO> appointments = appointmentService.getTodayAppointmentsByDoctor(doctorId, todaydate);
            return ResponseEntity.ok(appointments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

//    @GetMapping("/doctor/{doctorId}")
//    @PreAuthorize("hasAnyRole('DOCTOR', 'USER')")
//    public ResponseEntity<List<AppointmentShowDTO>> getAppointmentsByDoctor(
//            @PathVariable Integer doctorId,
//            @RequestHeader("Authorization") String authHeader) {
//            
//        try {
//            // Extract token from Authorization header
//            String token = authHeader.substring(7);
//            String email = jwtService.extractUserEmail(token);
//            String role = jwtService.extractUserRole(token);
//                    
//            // If it's a doctor, verify they're accessing their own appointments
//            if ("DOCTOR".equals(role)) {
//                Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(email);
//                if (!authenticatedDoctor.getDoctorId().equals(Long.valueOf(doctorId))) {
//                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//                }
//            }
//                    
//            List<AppointmentShowDTO> appointments = appointmentService.getAppointments(doctorId);
//            return ResponseEntity.ok(appointments);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('DOCTOR','USER')")
    public ResponseEntity<List<AppointmentShowDTO>> getDoctorAppointments(
            @PathVariable Integer doctorId,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String email = jwtService.extractUserEmail(token);
            
//             Verify that the doctor is accessing their own appointments
//            Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(email);
//            if (!authenticatedDoctor.getDoctorId().equals(doctorId)) {
//                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//            }
            
            List<AppointmentShowDTO> appointments = appointmentService.getAppointmentsByDoctorId(doctorId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


//    @PostMapping("/{appointmentId}/accept/{doctorId}")
//    @PreAuthorize("hasRole('DOCTOR')")
//    public ResponseEntity<Appointment> acceptAppointment(
//            @PathVariable Integer appointmentId,
//            @PathVariable Integer doctorId,
//            @RequestHeader("Authorization") String authHeader) {
//        
//        try {
//            // Extract token from Authorization header
//            String token = authHeader.substring(7);
//            String email = jwtService.extractUserEmail(token);
//            
//            // Verify that the doctor is accepting their own appointment
//            Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(email);
//            if (!authenticatedDoctor.getDoctorId().equals(Long.valueOf(doctorId))) {
//                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//            }
//            
//            Appointment updatedAppointment = appointmentService.acceptAppointment(appointmentId, doctorId);
//            return ResponseEntity.ok(updatedAppointment);
//        } catch (AppointmentNotFoundException e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
    @PostMapping("/{appointmentId}/accept/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Appointment> acceptAppointment(
            @PathVariable Long appointmentId,
            @PathVariable Long doctorId,
            @RequestHeader("Authorization") String authHeader) {
                
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String email = jwtService.extractUserEmail(token);
                        
            // Verify that the doctor is accepting their own appointment
            Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(email);
            
            // Convert both to the same type for comparison
            if (!(authenticatedDoctor.getDoctorId().intValue() == doctorId.intValue())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
                        
            Appointment updatedAppointment = appointmentService.acceptAppointment(appointmentId, doctorId);
            return ResponseEntity.ok(updatedAppointment);
        } catch (AppointmentNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{appointmentId}/reject/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Appointment> rejectAppointment(
            @PathVariable Long appointmentId,
            @PathVariable Long doctorId,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String email = jwtService.extractUserEmail(token);
            
            // Verify that the doctor is rejecting their own appointment
            Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(email);
            if (authenticatedDoctor.getDoctorId()!=doctorId){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            Appointment updatedAppointment = appointmentService.rejectAppointment(appointmentId, doctorId);
            return ResponseEntity.ok(updatedAppointment);
        } catch (AppointmentNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/countall")
    public ResponseEntity<Integer> getAllAppointmentsCount() {
        try {
            return ResponseEntity.ok(appointmentService.getAllAppointments().size());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

   
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<AppointmentSummaryDTO>> getUserAppointments(
            @PathVariable Integer userId,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String email = jwtService.extractUserEmail(token);
            
            // Verify that the user is accessing their own appointments
            if (!appointmentService.isUserEmailMatching(userId, email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            List<AppointmentSummaryDTO> appointments = appointmentService.getAppointmentSummaries(userId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
//    @PatchMapping("/{appointmentId}/status/{setStatus}")
//    @PreAuthorize("hasAnyRole('USER', 'DOCTOR', 'ADMIN')")
//    public ResponseEntity<String> changeStatus(
//            @PathVariable Integer appointmentId,
//            @PathVariable String setStatus,
//            @RequestHeader("Authorization") String authHeader) {
//        
//        try {
//            // Extract token from Authorization header
//            String token = authHeader.substring(7);
//            String email = jwtService.extractUserEmail(token);
//            String role = jwtService.extractUserRole(token);
//            
//            // Verify permissions based on role
//            if ("USER".equals(role)) {
//                // Users can only cancel their own appointments
//                if (!appointmentService.isAppointmentForUserEmail(appointmentId, email)) {
//                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update your own appointments");
//                }
//                
//                // Users can only cancel appointments
//                if (!"CANCELLED".equalsIgnoreCase(setStatus)) {
//                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Users can only cancel appointments");
//                }
//            } else if ("DOCTOR".equals(role)) {
//                // Doctors can only update appointments assigned to them
//                Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(email);
//                if (!appointmentService.isAppointmentForDoctor(appointmentId, authenticatedDoctor.getDoctorId().intValue())) {
//                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update appointments assigned to you");
//                }
//                
//                // Doctors can update to CONFIRMED, COMPLETED, or CANCELLED
//                if (!("CONFIRMED".equalsIgnoreCase(setStatus) ||
//                       "COMPLETED".equalsIgnoreCase(setStatus) ||
//                       "CANCELLED".equalsIgnoreCase(setStatus))) {
//                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status value");
//                }
//            } else if (!"ADMIN".equals(role)) {
//                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized role");
//            }
//            
//            // Update the appointment status
//            boolean updated = appointmentService.updateAppointmentStatus(appointmentId, setStatus.toUpperCase());
//            
//            if (updated) {
//                return ResponseEntity.ok("Appointment status updated successfully");
//            } else {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found");
//            }
//            
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error updating appointment status: " + e.getMessage());
//        }
//    }
//    @PatchMapping("/{appointmentId}/status/{setStatus}")
//    @PreAuthorize("hasAnyRole('USER', 'DOCTOR', 'ADMIN')")
//    public ResponseEntity<String> changeStatus(
//            @PathVariable Integer appointmentId,
//            @PathVariable String setStatus,
//            @RequestHeader("Authorization") String authHeader) {
//                
//        try {
//            // Add logging to debug the request
//            System.out.println("Received request to update appointment " + appointmentId + " to status " + setStatus);
//            
//            // Extract token from Authorization header
//            String token = authHeader.substring(7);
//            String email = jwtService.extractUserEmail(token);
//            String role = jwtService.extractUserRole(token);
//            
//            System.out.println("User email: " + email + ", role: " + role);
//                        
//            // Verify permissions based on role
//            if ("USER".equals(role)) {
//                // Users can only cancel their own appointments
//                if (!appointmentService.isAppointmentForUserEmail(appointmentId, email)) {
//                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update your own appointments");
//                }
//                                
//                // Users can only cancel appointments
//                if (!"CANCELLED".equalsIgnoreCase(setStatus)) {
//                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Users can only cancel appointments");
//                }
//            } else if ("DOCTOR".equals(role)) {
//                // Doctors can only update appointments assigned to them
//                Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(email);
//                
//                System.out.println("Doctor ID: " + authenticatedDoctor.getDoctorId());
//                
//                if (!appointmentService.isAppointmentForDoctor(appointmentId, authenticatedDoctor.getDoctorId().intValue())) {
//                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update appointments assigned to you");
//                }
//                                
//                // Doctors can update to CONFIRMED, COMPLETED, or CANCELLED
//                if (!("CONFIRMED".equalsIgnoreCase(setStatus) ||
//                       "COMPLETED".equalsIgnoreCase(setStatus) ||
//                       "CANCELLED".equalsIgnoreCase(setStatus))) {
//                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status value");
//                }
//            } else if (!"ADMIN".equals(role)) {
//                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized role");
//            }
//                        
//            // Update the appointment status
//            boolean updated = appointmentService.updateAppointmentStatus(appointmentId, setStatus.toUpperCase());
//                        
//            if (updated) {
//                return ResponseEntity.ok("Appointment status updated successfully");
//            } else {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found");
//            }
//                    
//        } catch (Exception e) {
//            // Log the full stack trace for debugging
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error updating appointment status: " + e.getMessage());
//        }
//    }
    @PatchMapping("/{appointmentId}/status/{setStatus}")
    @PreAuthorize("hasAnyRole('USER', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<String> changeStatus(
            @PathVariable Long appointmentId,
             @PathVariable String setStatus,
            @RequestHeader("Authorization") String authHeader) {
                    
        try {
            // Add logging to debug the request
            System.out.println("Received request to update appointment " + appointmentId + " to status " + setStatus);
                    
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String email = jwtService.extractUserEmail(token);
            String role = jwtService.extractUserRole(token);
                    
            System.out.println("User email: " + email + ", role: " + role);
                                
            // Standardize status format for comparison (convert to uppercase)
            String statusUpperCase = setStatus.toUpperCase();
            
            // Verify permissions based on role
            if ("USER".equals(role)) {
                // Users can only cancel their own appointments
                if (!appointmentService.isAppointmentForUserEmail(appointmentId, email)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update your own appointments");
                }
                                            
                // Users can only cancel appointments
                if (!"CANCELLED".equalsIgnoreCase(setStatus)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Users can only cancel appointments");
                }
            } else if ("DOCTOR".equals(role)) {
                // Doctors can only update appointments assigned to them
                Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(email);
                            
                System.out.println("Doctor ID: " + authenticatedDoctor.getDoctorId());
                            
                if (!appointmentService.isAppointmentForDoctor(appointmentId, authenticatedDoctor.getDoctorId().intValue())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update appointments assigned to you");
                }
                                            
                // Doctors can update to CONFIRMED, COMPLETED, or CANCELLED
                if (!("CONFIRMED".equalsIgnoreCase(setStatus) ||
                       "COMPLETED".equalsIgnoreCase(setStatus) ||
                       "CANCELLED".equalsIgnoreCase(setStatus))) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status value");
                }
            } else if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized role");
            }
                                        
            // Update the appointment status - pass the original case-sensitive value
            boolean updated = appointmentService.updateAppointmentStatus(appointmentId, setStatus);
                                        
            if (updated) {
                return ResponseEntity.ok("Appointment status updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found");
            }
                        
        } catch (Exception e) {
            // Log the full stack trace for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating appointment status: " + e.getMessage());
        }
    }

}

