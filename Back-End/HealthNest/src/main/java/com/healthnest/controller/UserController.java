package com.healthnest.controller;

import java.util.HashMap;
import java.util.List;

import com.healthnest.model.FeedBack;
import com.healthnest.repository.FeedBackRepository;
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
    private FeedBackRepository feedBackRepository;
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
	public User getUserDetails(@PathVariable Integer userId) {
	    return userService.getUserDetails(userId);
	}

	@PostMapping("/feeback")
	public String submitFeedback(@RequestBody FeedBack feedBack) {
		return feedBackService.addFeedBack(feedBack);
	}
	

	@PatchMapping("/editprofile")
	public ResponseEntity<String> editProfile(@RequestBody User user) {
		boolean updated = userService.editProfile(user);
		if (updated) {
			return ResponseEntity.ok("Profile successfully edited");
		} else {
			return ResponseEntity.status(404).body("User not found. Failed to edit profile.");
		}
	}

	@GetMapping("/upcoming/{userId}")
    public ResponseEntity<List<AppointmentSummaryDTO>> getUpcomingAppointments(@PathVariable Integer userId) {
        List<AppointmentSummaryDTO> result = appointmentService.getAppointmentSummaries(userId, "Upcoming");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/completed/{userId}")
    public ResponseEntity<List<AppointmentSummaryDTO>> getCompletedAppointments(@PathVariable Integer userId) {
        List<AppointmentSummaryDTO> result = appointmentService.getAppointmentSummaries(userId, "Completed");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/cancelled/{userId}")
    public ResponseEntity<List<AppointmentSummaryDTO>> getCancelledAppointments(@PathVariable Integer userId) {
        List<AppointmentSummaryDTO> result = appointmentService.getAppointmentSummaries(userId, "Cancelled");
        return ResponseEntity.ok(result);
    }

	@PatchMapping("/cancelappointment/{appointmentId}")
	public ResponseEntity<String> cancelAppointment(@PathVariable Integer appointmentId) {
		userService.cancelAppointment(appointmentId);
		return ResponseEntity.ok("successfully cancelled Appointment");
	}

	@PatchMapping("/changepassword/{userid}/{beforepassword}/{changepassword}")
	public ResponseEntity<String> changepassword(@PathVariable Integer userid, @PathVariable String beforepassword,
			@PathVariable String changepassword) {
		if (userService.changePassword(userid, beforepassword, changepassword)) {
			return ResponseEntity.ok("successfully changed");
		} else {
			return ResponseEntity.ok("unsuccessful");
		}

	}

	@DeleteMapping("/deleteuser/{userId}")
	public ResponseEntity<String> deleteAccount(@PathVariable Integer userId) {
		userService.deleteAccount(userId);
		return ResponseEntity.ok("Successfully deleted user");
	}
	
	@PostMapping("/bookappointment")
	public ResponseEntity<String> bookAppointment(@RequestBody Appointment appointment)
	{
		if(userService.bookAppointment(appointment))
		{
			return ResponseEntity.ok("your appointment is Successfully booked");
		}
		else
		{
			return ResponseEntity.ok("your appointment is not booked try again");
			
		}
	}
}
