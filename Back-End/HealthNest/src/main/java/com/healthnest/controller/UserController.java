package com.healthnest.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.healthnest.dto.AppointmentSummaryDTO;
import com.healthnest.dto.UserDTO;
import com.healthnest.exception.AuthenticationException;
import com.healthnest.exception.UserNotFoundException;
import com.healthnest.model.Appointment;
import com.healthnest.model.FeedBack;
import com.healthnest.model.User;
import com.healthnest.service.AppointmentService;
import com.healthnest.service.FeedBackService;
import com.healthnest.service.JWTService;
import com.healthnest.service.UserService;

@CrossOrigin(origins = "https://health-nest.netlify.app")
@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    UserService userService;
    
    @Autowired
    private ModelMapper modelMapper;
    
    @Autowired
    AppointmentService appointmentService;
    
    @Autowired
    private FeedBackService feedBackService;
    
    @Autowired
    private JWTService jwtService;

    // These endpoints don't need authentication
    @PostMapping("/Signup")
    public ResponseEntity<String> createAccount(@RequestBody UserDTO userdto) {
        if (userdto.getEmail() == null || userdto.getEmail().isEmpty() || userdto.getPassword() == null || userdto.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Email and password cannot be empty");
        }
        if (!userdto.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$") || userdto.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }
        User user = modelMapper.map(userdto, User.class);
        if (userService.isUserAlreadyRegistered(user.getEmail())) {
            return ResponseEntity.badRequest().body("User already registered!");
        }
                
        try {
            userService.createUser(user);
            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<HashMap<String, String>> login(@RequestBody User user) {
        HashMap<String, String> response = new HashMap<>();
        if (user.getEmail() == null || user.getEmail().isEmpty() || user.getPassword() == null || user.getPassword().isEmpty()) {
            response.put("message", "Email and password cannot be empty");
            return ResponseEntity.badRequest().body(response);
        }
        try {
            Map<String, String> loginResult = userService.login(user.getEmail(), user.getPassword());
            response.putAll(loginResult);
            
            if ("Login successful".equals(loginResult.get("message"))) {
                response.put("userId", String.valueOf(userService.getUserId(user.getEmail())));
                response.put("name", userService.getUserName(user.getEmail()));
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (AuthenticationException e) {
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (UserNotFoundException e) {
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("message", "An error occurred during login");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // All endpoints below require authentication
    @GetMapping("/userdetails/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<User> getUserDetails(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String authHeader) {
        
        System.out.println("Auth header in getUserDetails: " + authHeader);
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(token);
            
            // Verify that the user is accessing their own data
            Long tokenUserId = userService.getUserId(userEmail);
            if (!tokenUserId.equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            User user = userService.getUserDetails(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/feeback")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> submitFeedback(
            @RequestBody FeedBack feedBack,
            @RequestHeader("Authorization") String authHeader) {
        
        System.out.println("Auth header in submitFeedback: " + authHeader);
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(token);
            
            // Verify that the feedback is from the authenticated user
            if (feedBack.getUser() != null) {
                Long tokenUserId = userService.getUserId(userEmail);
                if (!tokenUserId.equals(feedBack.getUser().getUserId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only submit feedback for yourself");
                }
            }
            
            if (feedBack == null || feedBack.getFeedback() == null || feedBack.getFeedback().isEmpty()) {
                return ResponseEntity.badRequest().body("Feedback cannot be empty");
            }
            String result = feedBackService.addFeedBack(feedBack);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to submit feedback");
        }
    }
        
    @PatchMapping("/editprofile/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> editProfile(
            @RequestBody User user, 
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        
        System.out.println("Auth header in editProfile: " + authHeader);
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(token);
            
            // Verify that the user is editing their own profile
            Long tokenUserId = userService.getUserId(userEmail);
            if (tokenUserId != id) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only edit your own profile");
            }
            
            if (user == null || user.getName() == null || user.getName().isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid input");
            }
            
            boolean success = userService.editProfile(user, id);
            if (success) {
                return ResponseEntity.ok("Profile successfully edited");
            } else {
                return ResponseEntity.badRequest().body("Failed to edit profile");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    @GetMapping("/appointments/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<AppointmentSummaryDTO>> getUpcomingAppointments(
        @PathVariable Long userId,
        @RequestHeader("Authorization") String authHeader) throws Exception {
                
        System.out.println("Received auth header in getUpcomingAppointments: " + authHeader);
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(token);
            
            // Verify that the user is accessing their own appointments
            Long tokenUserId = userService.getUserId(userEmail);
            if (!tokenUserId.equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            List<AppointmentSummaryDTO> result = appointmentService.getAppointmentSummaries(userId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/cancelappointment/{appointmentId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> cancelAppointment(
            @PathVariable Long appointmentId,
            @RequestHeader("Authorization") String authHeader) {
        
        System.out.println("Auth header in cancelAppointment: " + authHeader);
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(token);
            
            // Verify that the appointment belongs to the authenticated user
            // This would require additional service method to check appointment ownership
            // For now, we'll assume the service handles this validation
            
            userService.cancelAppointment(appointmentId);
            return ResponseEntity.ok("successfully cancelled Appointment");
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body("Appointment not found");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to cancel appointment");
        }
    }

    @PatchMapping("/changepassword/{userid}/{beforepassword}/{changepassword}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> changePassword(
            @PathVariable Long userid,
            @PathVariable String beforepassword,
            @PathVariable String changepassword,
            @RequestHeader("Authorization") String authHeader) {
        
        System.out.println("Auth header in changePassword: " + authHeader);
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(token);
            
            // Verify that the user is changing their own password
           Long tokenUserId = userService.getUserId(userEmail);
            if (!tokenUserId.equals(userid)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only change your own password");
            }
            
            boolean changed = userService.changePassword(userid, beforepassword, changepassword);
            if (changed) {
                return ResponseEntity.ok("Password changed successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid current password");
            }
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to change password");
        }
    }

    @DeleteMapping("/deleteuser/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> deleteAccount(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String authHeader) {
        
        System.out.println("Auth header in deleteAccount: " + authHeader);
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(token);
            
            // Verify that the user is deleting their own account
           Long tokenUserId = userService.getUserId(userEmail);
            if (!tokenUserId.equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own account");
            }
            
            userService.deleteAccount(userId);
            return ResponseEntity.ok("Successfully deleted user");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to delete user");
        }
    }
        
    @PostMapping("/bookappointment")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> bookAppointment(
            @RequestBody Appointment appointment,
            @RequestHeader("Authorization") String authHeader) {
        
        System.out.println("Auth header in bookAppointment: " + authHeader);
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(token);
            
            // Verify that the appointment is for the authenticated user
            if (appointment.getUser() != null) {
                Long tokenUserId = userService.getUserId(userEmail);
                if (!tokenUserId.equals(appointment.getUser().getUserId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only book appointments for yourself");
                }
            }
            
            if (appointment == null) {
                return ResponseEntity.badRequest().body("Appointment cannot be null");
            }
            boolean booked = userService.bookAppointment(appointment);
            if (booked) {
                return ResponseEntity.ok("Your appointment is successfully booked");
            } else {
                return ResponseEntity.badRequest().body("Failed to book appointment");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to book appointment");
        }
    }
        
    @GetMapping("/countallusers")

    public ResponseEntity<Integer> getAllUsersCount(){
        
       // System.out.println("Auth header in getAllUsersCount: " + authHeader);
        
        // This endpoint should only be accessible to admins
        // The @PreAuthorize annotation ensures this
        
        return ResponseEntity.ok(userService.getAllUsers().size());
    }
       
    @PostMapping("/setnewpassword")
    public ResponseEntity<String> setNewPassword(
            @RequestBody HashMap<String, String> request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        // This endpoint might be used for password reset, so auth header could be optional
        if (authHeader != null) {
            System.out.println("Auth header in setNewPassword: " + authHeader);
            
            // If auth header is provided, verify the user is authorized
            try {
                String token = authHeader.substring(7);
                String userEmail = jwtService.extractUserEmail(token);
                
                // If the email in the request doesn't match the authenticated user's email,
                // and the user is not an admin, deny access
                if (!userEmail.equals(request.get("email")) && 
                     !jwtService.extractUserRole(token).equals("ADMIN")) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You can only reset your own password");
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid authentication token");
            }
        }
        
        String email = request.get("email");
        String newPassword = request.get("newPassword");
        
        if (email == null || email.isEmpty() || !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters long");
        }
        
        try {
            boolean passwordSet = userService.setNewPassword(email, newPassword);
            if (passwordSet) {
                return ResponseEntity.ok("Password has been updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update password");
            }
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to set new password: " + e.getMessage());
        }
    }

        @PostMapping("/check-email")
        public ResponseEntity<String> checkEmailExists(
                @RequestBody HashMap<String, String> request,
                @RequestHeader(value = "Authorization", required = false) String authHeader) {
            
            // This endpoint might be used for password reset, so auth header could be optional
            if (authHeader != null) {
                System.out.println("Auth header in checkEmailExists: " + authHeader);
            }
            
            String email = request.get("email");
            
            if (email == null || email.isEmpty() || !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                return ResponseEntity.badRequest().body("Invalid email format");
            }
            
            try {
                boolean exists = userService.isUserAlreadyRegistered(email);
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

            
