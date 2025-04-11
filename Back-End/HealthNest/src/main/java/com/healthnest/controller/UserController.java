package com.healthnest.controller;

import java.util.HashMap;
import java.util.List;

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
import com.healthnest.model.Appointment;
import com.healthnest.model.User;
import com.healthnest.service.AppointmentService;
import com.healthnest.service.UserService;
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
		User user = modelMapper.map(userdto, User.class);
		if (userService.isUserAlreadyRegistered(user.getEmail())) {
			return ResponseEntity.badRequest().body("User already registered!");
		}
		userService.createUser(user);
		return ResponseEntity.ok("User registered successfully!");
	}
	@PostMapping("/login")
	public ResponseEntity<HashMap<String, String>> login(@RequestBody User user) {
	    HashMap<String, String> response = new HashMap<>();

	    String loginResult = userService.login(user.getEmail(), user.getPassword());

	    response.put("message", loginResult);

	    if ("Login successful".equals(loginResult)) {
	        String id = userService.getUserId(user.getEmail()).toString();
	        String name=userService.getUserName(user.getEmail());
	        response.put("userId", id);
	        response.put("name", name);
	        return ResponseEntity.ok(response);
	    } else {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	    }
	}

	@GetMapping("/userdetails/{userId}")
	public ResponseEntity<User> getUserDetails(@PathVariable Integer userId) {
	    User user = userService.getUserDetails(userId);
	    return ResponseEntity.ok(user);
	}

	@PostMapping("/feeback")
	public String submitFeedback(@RequestBody FeedBack feedBack) {
		return feedBackService.addFeedBack(feedBack);
	}
	

	@PatchMapping("/editprofile/{userId}")
	public ResponseEntity<String> editProfile(@RequestBody User user, @PathVariable Integer userId) {
		userService.editProfile(user, userId);
		return ResponseEntity.ok("Profile successfully edited");
	}

	@GetMapping("/appointments/{userId}")
    public ResponseEntity<List<AppointmentSummaryDTO>> getUpcomingAppointments(@PathVariable Integer userId) {
        List<AppointmentSummaryDTO> result = appointmentService.getAppointmentSummaries(userId);
        return ResponseEntity.ok(result);
    }

	@PatchMapping("/cancelappointment/{appointmentId}")
	public ResponseEntity<String> cancelAppointment(@PathVariable Integer appointmentId) {
		userService.cancelAppointment(appointmentId);
		return ResponseEntity.ok("successfully cancelled Appointment");
	}

	@PatchMapping("/changepassword/{userid}/{beforepassword}/{changepassword}")
	public ResponseEntity<String> changePassword(@PathVariable Integer userid, 
	                                             @PathVariable String beforepassword,
	                                             @PathVariable String changepassword) {
	    boolean success = userService.changePassword(userid, beforepassword, changepassword);
	    if (!success) {
	        throw new IllegalArgumentException("Invalid current password");
	    }
	    return ResponseEntity.ok("Password changed successfully");
	}

	@DeleteMapping("/deleteuser/{userId}")
	public ResponseEntity<String> deleteAccount(@PathVariable Integer userId) {
		userService.deleteAccount(userId);
		return ResponseEntity.ok("Successfully deleted user");
	}
	
	@PostMapping("/bookappointment")
	public ResponseEntity<String> bookAppointment(@RequestBody Appointment appointment) {
	    boolean success = userService.bookAppointment(appointment);
	    if (!success) {
	        throw new IllegalArgumentException("Unable to book appointment");
	    }
	    return ResponseEntity.ok("Your appointment is successfully booked");
	}
}
