package com.healthnest.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
	AppointmentService appointmentservice;

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



	

	@PatchMapping("/editprofile")
	public ResponseEntity<String> editProfile(@RequestBody User user) {
		boolean updated = userService.editProfile(user);
		if (updated) {
			return ResponseEntity.ok("Profile successfully edited");
		} else {
			return ResponseEntity.status(404).body("User not found. Failed to edit profile.");
		}
	}

	@GetMapping("/getupcomingappointments/{id}")
	public List<Map<String, Object>> getupcomingAppointments1(@PathVariable Integer id) {
		return appointmentservice.getUpcomingAppointments(id);

	}

	@GetMapping("/getcompletedappointments/{id}")
	public List<Map<String, Object>> getCompletedAppointments(@PathVariable Integer id) {
		return appointmentservice.getCompletedAppointments(id);

	}

	@GetMapping("/getcanceledappointments/{id}")
	public List<Map<String, Object>> getCanceledAppointments(@PathVariable Integer id) {
		return appointmentservice.getCancelledAppointments(id);

	}

	@PatchMapping("/cancelappointment/{appointmentId}")
	public ResponseEntity<String> cancelAppointment(@PathVariable Integer appointmentId) {
		userService.cancleAppointment(appointmentId);
		return ResponseEntity.ok("sucessfully cancelled Appointment");
	}

	@PatchMapping("/changepassword/{userid}/{beforepassword}/{changepassword}")
	public ResponseEntity<String> changepassword(@PathVariable Integer userid, @PathVariable String beforepassword,
			@PathVariable String changepassword) {
		if (userService.changePassword(userid, beforepassword, changepassword)) {
			return ResponseEntity.ok("sucessfully changed");
		} else {
			return ResponseEntity.ok("unsucessfull");
		}

	}

	@DeleteMapping("/deleteuser/{userId}")
	public ResponseEntity<String> deleteAccount(@PathVariable Integer userId) {
		userService.deleteAccount(userId);
		return ResponseEntity.ok("Sucessfully deleted user");
	}
	
	@PostMapping("/bookappointment")
	public ResponseEntity<String> bookAppointment(@RequestBody Appointment appointment)
	{
		if(userService.bookAppointment(appointment))
		{
			return ResponseEntity.ok("your appointment is Sucessfully booked");
		}
		else
		{
			return ResponseEntity.ok("your appointment is not booked try again");
			
		}
	}
}
