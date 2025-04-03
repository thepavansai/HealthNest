package com.healthnest.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnest.model.User;
import com.healthnest.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
	@Autowired UserService userService;
	
	@PostMapping("/Signup")
	public ResponseEntity<String> cerateAccount(@RequestBody User user)
	{
		if(userService.isUserAlreadyRegistered(user.getEmail()))
		{
		 return ResponseEntity.badRequest().body("User already registered!");
        }
        userService.createUser(user);
        return ResponseEntity.ok("User registered successfully!");
		}
		
	}


