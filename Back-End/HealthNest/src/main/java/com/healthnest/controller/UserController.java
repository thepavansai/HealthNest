package com.healthnest.controller;

import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnest.dto.UserDTO;
import com.healthnest.model.User;
import com.healthnest.service.AppointmentService;
import com.healthnest.service.UserService;

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
	public ResponseEntity<String> createAccount(@RequestBody UserDTO userdto)
	{	User user= modelMapper.map(userdto, User.class);
		if(userService.isUserAlreadyRegistered(user.getEmail()))
		{
		 return ResponseEntity.badRequest().body("User already registered!");
        }
        userService.createUser(user);
        return ResponseEntity.ok("User registered successfully!");
		}
	
	@GetMapping("/getupcomingappointments/{id}")
	public List<Map<String, Object>> getupcomingAppointments1(@PathVariable Integer id)
	{
		return appointmentservice.getUpcomingAppointments(id);
		
	}
	@GetMapping("/getcompletedappointments/{id}")
	public List<Map<String, Object>> getCompletedAppointments(@PathVariable Integer id)
	{
		return appointmentservice.getCompletedAppointments(id);
		
	}
	@GetMapping("/getcanceledappointments/{id}")
	public List<Map<String, Object>> getCanceledAppointments(@PathVariable Integer id)
	{
		return appointmentservice.getCancelledAppointments(id);
		
	}

	
	
		
	}


