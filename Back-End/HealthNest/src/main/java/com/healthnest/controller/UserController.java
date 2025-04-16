package com.healthnest.controller;

import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;

import com.healthnest.model.FeedBack;
import com.healthnest.service.FeedBackService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnest.dto.AppointmentSummaryDTO;
import com.healthnest.dto.UserDTO;
import com.healthnest.exception.UserNotFoundException;
import com.healthnest.model.Appointment;
import com.healthnest.model.User;
import com.healthnest.service.AppointmentService;
import com.healthnest.service.UserService;
import com.healthnest.exception.AuthenticationException;

@CrossOrigin(origins = "http://localhost:3000")
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
            String loginResult = userService.login(user.getEmail(), user.getPassword());
            response.put("message", loginResult);

            if ("Login successful".equals(loginResult)) {
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

    @GetMapping("/userdetails/{userId}")
    public ResponseEntity<User> getUserDetails(@PathVariable Integer userId) {
        User user = userService.getUserDetails(userId);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/feeback")
    public ResponseEntity<String> submitFeedback(@RequestBody FeedBack feedBack) {
        try {
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
    public ResponseEntity<String> editProfile(@RequestBody User user, @PathVariable int id) {
        if (user == null || user.getName() == null || user.getName().isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid input");
        }
        try {
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
    public ResponseEntity<List<AppointmentSummaryDTO>> getUpcomingAppointments(@PathVariable Integer userId) {
        List<AppointmentSummaryDTO> result = appointmentService.getAppointmentSummaries(userId);
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/cancelappointment/{appointmentId}")
    public ResponseEntity<String> cancelAppointment(@PathVariable Integer appointmentId) {
        try {
            userService.cancelAppointment(appointmentId);
            return ResponseEntity.ok("successfully cancelled Appointment");
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body("Appointment not found");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to cancel appointment");
        }
    }

    @PatchMapping("/changepassword/{userid}/{beforepassword}/{changepassword}")
    public ResponseEntity<String> changePassword(@PathVariable Integer userid, 
                                                 @PathVariable String beforepassword,
                                                 @PathVariable String changepassword) {
        try {
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
    public ResponseEntity<String> deleteAccount(@PathVariable Integer userId) {
        try {
            userService.deleteAccount(userId);
            return ResponseEntity.ok("Successfully deleted user");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to delete user");
        }
    }
    
    @PostMapping("/bookappointment")
    public ResponseEntity<String> bookAppointment(@RequestBody Appointment appointment) {
        try {
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
    public ResponseEntity<Integer> getAllUsersCount()
    {
        return ResponseEntity.ok(userService.getAllUsers().size());
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
    public ResponseEntity<String> checkEmailExists(@RequestBody HashMap<String, String> request) {
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
